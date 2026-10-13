# syntax=docker/dockerfile:1.10
# See DOCKER.md for usage.

ARG NODE_VERSION=22-alpine

# ---------- base ----------
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps: install node_modules + generate the Prisma client ----------
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# `postinstall` runs `prisma generate`, which loads prisma.config.ts; that needs *a*
# datasource URL to parse but never connects, so a placeholder is enough here.
RUN --mount=type=cache,target=/root/.npm \
    DATABASE_URL=postgresql://placeholder@localhost:5432/placeholder \
    npm ci --no-audit --no-fund

# ---------- migrate: one-off `prisma migrate deploy` (compose `migrate` service) ----------
FROM deps AS migrate
USER node
CMD ["npx", "prisma", "migrate", "deploy"]

# ---------- dev: `next dev` with the source bind-mounted (compose `dev` service) ----------
FROM deps AS dev
# Non-recursive: node only needs to write .next (a container volume); a recursive
# chown of node_modules would duplicate the whole layer
RUN mkdir .next && chown node:node /app /app/.next /app/generated
USER node
EXPOSE 3000
# Webpack instead of Turbopack: Turbopack's watcher misses edits on bind mounts,
# while Watchpack picks them up with WATCHPACK_POLLING (set in compose.yaml)
CMD ["npm", "run", "dev", "--", "--webpack", "--hostname", "0.0.0.0", "--port", "3000"]

# ---------- builder: production build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY . .

# Public values Next inlines into the bundle / prerendered HTML at build time.
# Build args are already in the RUN environment.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG GOOGLE_SITE_VERIFICATION
ENV BUILD_STANDALONE=1

# Public pages and the sitemap query Postgres while prerendering, so the build needs
# DATABASE_URL. It's mounted as a BuildKit secret: visible to this RUN only, never
# written to a layer or the image history.
# Optional args arrive as "" when unset; drop them so the app's `??` defaults apply.
RUN --mount=type=secret,id=database_url,env=DATABASE_URL,required=true \
    --mount=type=secret,id=clerk_secret_key,env=CLERK_SECRET_KEY \
    --mount=type=cache,target=/app/.next/cache \
    : "${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:?build arg is required (did you pass --env-file .env.local?)}"; \
    [ -n "$NEXT_PUBLIC_SITE_URL" ] || unset NEXT_PUBLIC_SITE_URL; \
    [ -n "$GOOGLE_SITE_VERIFICATION" ] || unset GOOGLE_SITE_VERIFICATION; \
    npm run build

# ---------- runner: minimal production image ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Standalone output = server.js + only the traced node_modules. `.next` stays writable
# by `node` for the ISR / image-optimisation cache.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
# Pre-create the image cache dir so a fresh named volume mounted here inherits node ownership
RUN mkdir -p .next/cache/images && chown -R node:node .next/cache

USER node
EXPOSE 3000

# /robots.txt is static and DB-free, so this checks the server, not Postgres
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/robots.txt').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"

# Exec form: node is PID 1 and receives SIGTERM directly; Next's server drains
# in-flight requests before exiting.
CMD ["node", "server.js"]

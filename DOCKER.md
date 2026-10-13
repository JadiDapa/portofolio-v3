# Docker

The repo ships a multi-stage [`Dockerfile`](./Dockerfile) and a [`compose.yaml`](./compose.yaml) with three services:

| Service   | Profile   | What it is                                                                     | Port (host → container)   |
| --------- | --------- | ------------------------------------------------------------------------------ | ------------------------- |
| `app`     | (default) | Production image: Next.js standalone `server.js` on `node:22-alpine`, non-root | `${APP_PORT:-3000}:3000`  |
| `migrate` | `tools`   | One-off `prisma migrate deploy`                                                | —                         |
| `dev`     | `dev`     | `next dev --webpack` with the source bind-mounted (hot reload)                 | `${DEV_PORT:-3002}:3000`  |

There is no Postgres container: the app talks to the database in `DATABASE_URL` (Neon), same as outside Docker.

## Prerequisites

- Docker Desktop / Docker Engine with Compose v2.24+ (BuildKit is the default builder).
- A filled-in `.env.local` (template: [`.env.example`](./.env.example)). Compose reads it two ways:
  - **At runtime**, via `env_file`, for every service.
  - **At build time**, via interpolation. That's why every command below passes `--env-file .env.local`.

> **Tip:** to avoid typing the flag, set it once per shell: `export COMPOSE_ENV_FILES=.env.local` (bash), or `$env:COMPOSE_ENV_FILES='.env.local'` (PowerShell).

## How secrets are handled

| Variable                                                               | When it's needed          | How it gets in                                                                                       |
| ---------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                         | build **and** runtime     | Build: BuildKit secret, mounted for the `next build` step only and never stored in a layer. Runtime: `env_file`. |
| `CLERK_SECRET_KEY`                                                     | runtime (build: optional) | Same as above.                                                                                       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `GOOGLE_SITE_VERIFICATION` | build             | Build args. These are **public** values that Next inlines into the JS bundle and prerendered HTML.   |
| `UPLOADTHING_TOKEN`, `SMTP_*`, `CONTACT_TO_EMAIL`, `DIRECT_URL`        | runtime                   | `env_file` only.                                                                                     |

`.env*` files are excluded by `.dockerignore`, so no env file ever enters the build context. Check with `docker history portfolio:latest`.

**Why the build needs the database:** every public page and `sitemap.xml` query Prisma while `next build` prerenders them. The build host has to reach `DATABASE_URL`, and the image contains a snapshot of the published content at build time. CMS edits still show up immediately at runtime through `revalidatePath`. On a fresh container, pages start from that build-time snapshot again until they are revalidated, which is the same behaviour as a fresh Vercel deploy.

## Production

```bash
# Build and start in the background
docker compose --env-file .env.local up -d --build

# Status (look for "healthy") and logs
docker compose ps
docker compose logs -f app

# Stop and remove the container (the image-cache volume is kept)
docker compose down

# Rebuild from scratch, e.g. after a dependency change or a weird cache issue
docker compose --env-file .env.local build --no-cache app
docker compose --env-file .env.local up -d
```

Open http://localhost:3000 (or `APP_PORT`).

### Migrations

Migrations do **not** run automatically on start, because the database is production Neon. Run them explicitly before deploying a build that needs a new schema:

```bash
docker compose --env-file .env.local run --rm --build migrate
```

This uses `DIRECT_URL` when it is set, otherwise `DATABASE_URL` (see `prisma.config.ts`). Seeding or other Prisma CLI commands work the same way:

```bash
docker compose --env-file .env.local run --rm migrate npx prisma migrate status
docker compose --env-file .env.local run --rm migrate npx tsx prisma/seed.ts
```

The `migrate` image contains `node_modules`, `prisma/` and the generated client, which is everything `prisma/seed.ts` imports. It does not contain the rest of the app source.

### Without Compose

```bash
# bash. Secrets are read from env vars in your shell, not stored in the image.
export $(grep -v '^#' .env.local | xargs)   # or set them however you like
docker build \
  --secret id=database_url,env=DATABASE_URL \
  --secret id=clerk_secret_key,env=CLERK_SECRET_KEY \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
  --build-arg NEXT_PUBLIC_SITE_URL \
  --build-arg GOOGLE_SITE_VERIFICATION \
  -t portfolio:latest .

docker run -d --name portfolio --env-file .env.local -p 3000:3000 portfolio:latest
docker stop portfolio   # sends SIGTERM; Next drains in-flight requests first
```

On a server or CI, supply the same variables from the platform's secret store instead of `.env.local`.

### What's in the image

- **Stages:** `deps` (`npm ci` + `prisma generate`) → `builder` (`next build` with `output: "standalone"`) → `runner` (just `server.js`, the traced `node_modules`, `.next/static` and `public/`).
- **Runtime:** runs as the built-in non-root `node` user. Compose also sets `cap_drop: ALL` and `no-new-privileges`.
- **Standalone output:** enabled only when `BUILD_STANDALONE=1` (the Dockerfile sets it), so local `npm run build && npm start` and Vercel behave as before.
- **Healthcheck:** `GET /robots.txt`, a static route with no database dependency, so a Neon blip doesn't flap the container.
- **Shutdown:** `node server.js` runs as PID 1 in exec form and handles SIGTERM/SIGINT, finishing in-flight requests. Compose allows a 30 s grace period before SIGKILL.
- **Volume:** `image-cache` persists optimised `next/image` variants across restarts. Everything else is stateless; uploads live in UploadThing.

## Development in Docker (optional)

Native `npm run dev` is faster on Windows/macOS and remains the recommended workflow. Use the container to reproduce Linux-specific behaviour, such as sharp or Prisma on musl.

```bash
docker compose --env-file .env.local --profile dev up --build dev   # http://localhost:3002
docker compose --profile dev down
```

The repo is bind-mounted at `/app`. `node_modules`, `generated/` and `.next` stay in container-only volumes, so host (Windows) binaries never mix with Linux ones.

Bind mounts from Windows/macOS don't deliver file-change events into the container. The dev container therefore runs `next dev --webpack` with `WATCHPACK_POLLING`. Turbopack, the default for native `npm run dev`, didn't pick up edits on the bind mount even with polling. Expect edits to show up after a few seconds, and the first compile of each page to be slow (~15–20 s). Harmless `watch error … NotFound` lines can appear in the logs.

After changing `package.json` or `schema.prisma`, rebuild and recreate those volumes:

```bash
docker compose --env-file .env.local --profile dev up --build --renew-anon-volumes dev
```

## Troubleshooting

| Symptom                                                                    | Fix                                                                                                                                                                                                   |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: build arg is required` | You forgot `--env-file .env.local`, or `COMPOSE_ENV_FILES` isn't set.                                                                                                                                |
| Build fails at `next build` with `Can't reach database server` / `P1001`   | The build host can't reach `DATABASE_URL`. Check the network/VPN and Neon's IP allow-list. Also check that `DATABASE_URL` is exported (non-Compose builds).                                           |
| `secret database_url: not found`                                           | `DATABASE_URL` is empty in the env file or shell used for the build.                                                                                                                                  |
| Build is killed / `failed to receive status: rpc error … EOF`              | The Docker VM ran out of memory during `npm ci` or `next build`. Give Docker Desktop at least 4 GB (Settings → Resources), or on WSL2 raise `memory=` in `%UserProfile%\.wslconfig`, then retry. |
| Container `unhealthy`                                                      | Run `docker compose logs app`. Typical causes are missing runtime env, or `PORT` changed without updating the mapping.                                                                                |
| Sign-in fails on `localhost`                                               | Production Clerk keys only work on the configured domain. Use development keys for local containers.                                                                                                  |
| Port already in use                                                        | Set `APP_PORT` / `DEV_PORT` in `.env.local`.                                                                                                                                                          |
| Stale content right after `up`                                             | Expected: pages come from the build-time snapshot until the next CMS edit or revalidation. Rebuild to refresh the snapshot.                                                                           |
| Dev server doesn't pick up edits                                           | Polling is already on (`WATCHPACK_POLLING`, webpack dev). Wait a few seconds, make sure you edited files inside the repo, then `docker compose --profile dev restart dev`.                           |
| `ETIMEDOUT` to the database (build or runtime)                             | The network blocks outbound port 5432. Some Wi-Fi and corporate networks do this; Neon's port 443 still works. Test with `nc -zv <host> 5432` and try another network.                               |
| `getaddrinfo EAI_AGAIN` on the first request after start                   | Docker Desktop's DNS warming up. It clears on retry; if it persists, restart Docker Desktop.                                                                                                       |
| Shell inside the container                                                 | `docker compose exec app sh` (Alpine has `sh`, not `bash`).                                                                                                                                           |

# Portfolio

Personal portfolio site + CMS for Daffa Althaf Ridovani (Software Engineer / Electrical Engineer).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Prisma 7 + PostgreSQL, Clerk auth, TanStack Query/Table, and shadcn/ui.

See [CLAUDE.md](./CLAUDE.md) for architecture and conventions.

## Getting started

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Commands

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint        # run ESLint

# Prisma
npx prisma migrate dev       # create and apply migration
npx prisma migrate deploy    # apply migrations in prod
npx prisma generate          # regenerate client after schema changes
npx prisma studio            # open DB browser
tsx prisma/seed.ts            # seed the database
```

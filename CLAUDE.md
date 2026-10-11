# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint       # run ESLint

# Prisma
npx prisma migrate dev       # create and apply migration
npx prisma migrate deploy    # apply migrations in prod
npx prisma generate          # regenerate client after schema changes
npx prisma studio            # open DB browser
tsx prisma/seed.ts            # seed the database
```

## Architecture

This is Daffa Althaf Ridovani's personal portfolio site + CMS (Software Engineer / Electrical Engineer), built on a boilerplate that's used to reference my coding style. Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Prisma 7 + PostgreSQL, Clerk auth, TanStack Query + Table, shadcn/ui, `motion` for animation.

### Route groups

- `app/(auth)/` — sign-in, sign-up pages (Clerk-backed, redirect if already authenticated)
- `app/(dashboard)/` — admin dashboard, requires auth via `getCurrentUser()` in layout
- `app/(root)/` — public-facing pages: `/` (home), `/work` (+ `/work/[slug]`), `/about`, `/services` (+ `/services/[slug]`), `/contact`, `/journal` (+ `/journal/[slug]`)
- `app/action/` — Next.js Server Actions (all files are `"use server"`)
- `app/api/images/[filename]/` — serves uploaded images from `uploads/images/` on disk

### Server-side layers

```
app/action/          ← Server Actions: validate input → call Service → revalidatePath
servers/validators/  ← Zod schemas + DTO types (CreateXSchema, UpdateXSchema)
servers/services/    ← DB access via Prisma (XService.list / getById / create / update / delete)
lib/prisma.ts        ← singleton PrismaClient (uses PrismaPg adapter)
```

Actions import validators and services. Services import from `lib/prisma`. Nothing else should touch Prisma directly.

### Prisma

The client is generated to `generated/prisma/` (not the default location). Always import types and the client from `@/generated/prisma`, not from `@prisma/client`:

```ts
import { Prisma, Role } from "@/generated/prisma";
import prisma from "@/lib/prisma"; // or: import { prisma } from "@/lib/prisma"
```

Run `npx prisma generate` after any schema change. Migrations live in `prisma/migrations/`. Prisma config (`prisma.config.ts`) sets `schema`, `migrations.path`, and `migrations.seed`.

### Domain models

- **User** — linked to Clerk identity (matched by `username`); roles: `USER`, `ADMIN`; has many `Post`
- **Post** — journal (blog) entry; `title`, `slug` (unique), `content`, `thumbnail`, `published`, linked to a `User` author. Public routes and dashboard sidebar label this "Journal"; internal naming (`Post`, `PostService`, `/dashboard/posts`) is unchanged from the original blog boilerplate.
- **Project** — client/personal project entry; `title`, `slug` (unique), `client`, `category`, `summary`, `content`, `coverImage`, `year`, `published`, `featured` (drives the homepage "Featured Work" section)
- **Service** — a skill/offering shown for freelance/contract work; `title`, `slug` (unique), `summary`, `description`, `order`
- **Testimonial** — client quote; `quote`, `authorName`, `authorTitle`, `company`, `published`
- **Experience** — work/education timeline entry shown on the About page; `type` (`WORK` | `EDUCATION` enum), `organization`, `role`, `description`, `startDate`, `endDate` (`null` = "Present"), `order`
- **Recognition** — award/press/certification/competition row shown in the About page's "Recognition" list; `source`, `kind` (`AWARD` | `PRESS` | `CERTIFICATION` | `COMPETITION`), `title`, `url?`, `year?`, `order`, `published`. Managed in `/dashboard/recognition` (single create/edit dialog, `RecognitionDialog`).
- **ContactSubmission** — inquiry from the public contact form; `name`, `email`, `message`, `projectType`, `read`. Only `create` is public; list/mark-read/delete are dashboard-only (`/dashboard/inquiries`).

`Project`/`Service`/`Testimonial`/`Experience`/`Recognition`/`ContactSubmission` each follow the same layered pattern as `Post` (`servers/validators/`, `servers/services/`, `app/action/`). `Project` and `Service` use dedicated create/update dashboard pages (mirrors `Post`); `Testimonial`, `Experience` and `Recognition` use dialog-based create/edit (mirrors `User`).

### Auth

Clerk (`@clerk/nextjs`) handles identity. `getCurrentUser()` in `app/action/user.action.ts` reads the Clerk session, then looks up the internal `User` record by `username`. The dashboard layout calls this and redirects to `/sign-in` if unauthenticated.

### Components

- `components/ui/` — shadcn/ui primitives (radix-ui based); do not edit these manually, use the `shadcn` CLI
- `components/dashboard/` — dashboard-specific: `DataTable`, `TablePagination`, `TableSorter`, `SearchDataTable`, `DashboardSidebar`, `DashboardNavbar`, `DynamicBreadcrumb`, `PageHeader`
- `components/auth/` — sign-in/sign-up forms and layout pieces
- `components/root/` — public page sections. `/about` lives in `components/root/about/` with its styles in `app/about.css` (`ab-` prefix, built on the `wk-` primitives from `app/work.css`); `ExperienceTimeline` is no longer rendered there.

### Providers

`providers/Providers.tsx` wraps the app in `ClerkProvider` → `QueryClientProvider` → `ThemeProvider` (next-themes, default light — dark mode is available but not the source design). All three are client components.

### Styling

Tailwind v4 (PostCSS plugin). Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional classes. Brand palette: near-black `#0F0F0F` foreground, off-white `#F8F8F8` background, hot-pink `#FF2E79` primary/accent — set as raw hex in `app/globals.css` `:root`/`.dark` alongside the shadcn oklch tokens.

import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: `tsx prisma/seed.ts`,
  },
  datasource: {
    // The CLI (migrate) needs a direct connection: `migrate deploy` takes a Postgres
    // advisory lock, which times out through Neon's pooler (P1002). The app itself
    // keeps using the pooled DATABASE_URL (lib/prisma.ts).
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});

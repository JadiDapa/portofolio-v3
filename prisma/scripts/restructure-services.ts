/**
 * One-off, idempotent: collapses the five old services into the four new ones,
 * carries their media over and re-files projects under the new categories.
 *   npx tsx prisma/scripts/restructure-services.ts
 */
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { CATEGORY_REMAP, SERVICES, SERVICE_REDIRECTS } from "../data/services";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const old = await prisma.service.findMany({
    where: { slug: { in: Object.keys(SERVICE_REDIRECTS) } },
  });

  for (const s of SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    // Reuse the media of the first old service that maps here
    const media =
      existing?.media ??
      old.find((o) => SERVICE_REDIRECTS[o.slug] === s.slug && o.media)?.media ??
      null;

    await prisma.service.upsert({
      where: { slug: s.slug },
      // Never overwrite copy Daffa already edited in the dashboard
      update: existing?.skills ? {} : { skills: s.skills },
      create: { ...s, media },
    });
    console.log(`service  ${s.slug}`);
  }

  for (const [from, to] of Object.entries(CATEGORY_REMAP)) {
    const { count } = await prisma.project.updateMany({
      where: { category: from },
      data: { category: to },
    });
    if (count) console.log(`projects ${from} -> ${to} (${count})`);
  }

  const removed = await prisma.service.deleteMany({
    where: { slug: { in: Object.keys(SERVICE_REDIRECTS) } },
  });
  console.log(`removed ${removed.count} old services`);

  // Keep the order tidy
  for (const s of SERVICES) {
    await prisma.service.update({ where: { slug: s.slug }, data: { order: s.order } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

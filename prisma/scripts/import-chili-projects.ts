/**
 * One-off: creates (or refreshes) one of the thesis projects in prisma/data/chili-projects.ts.
 * Figures come from the thesis .docx, unzipped beforehand; `--media` is its `word/media/`.
 * On a re-run, images already uploaded for that project are reused unless `--reupload`.
 *   npx tsx prisma/scripts/import-chili-projects.ts <slug> --media <dir> [--reupload]
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { UTApi, UTFile } from "uploadthing/server";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import {
  SectionsSchema,
  cleanSections,
  type GalleryBlock,
  type Section,
} from "../../servers/validators/project.validator";
import { CHILI_PROJECTS, type DraftSection, type Fig } from "../data/chili-projects";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const args = process.argv.slice(2);
const mediaAt = args.indexOf("--media") + 1;
const mediaDir = mediaAt ? args[mediaAt] : undefined;
const slug = args.find((a, i) => !a.startsWith("--") && i !== mediaAt);
const reupload = args.includes("--reupload");

const MAX_WIDTH = 2400;
const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/** Mirrors optimiseImage + store in app/action/upload.action.ts (not importable: it's "use server" + Clerk). */
async function upload(utapi: UTApi, dir: string, file: string): Promise<string> {
  const data = await sharp(await readFile(path.join(dir, file)))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const { dominant } = await sharp(data).stats();
  const id = `${crypto.randomUUID()}-${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}.webp`;

  const [res] = await utapi.uploadFiles([
    new UTFile([new Uint8Array(data)], id, { type: "image/webp", customId: id }),
  ]);
  if (res.error) throw new Error(`${file}: ${res.error.message}`);
  return new URL(`/f/${id}`, res.data.ufsUrl).href;
}

/** fig → URL from what's already saved, pairing gallery blocks by section id and position. */
function knownUrls(
  drafts: DraftSection[],
  cover: Fig,
  saved: { coverImage: string | null; sections: unknown } | null,
) {
  const urls = new Map<string, string>();
  if (!saved) return urls;
  if (saved.coverImage) urls.set(cover.fig, saved.coverImage);

  const parsed = SectionsSchema.safeParse(saved.sections);
  if (!parsed.success) return urls;
  for (const d of drafts) {
    if (d.type !== "gallery") continue;
    const old = parsed.data.find((s) => s.id === d.id);
    if (old?.type !== "gallery") continue;
    d.blocks.forEach((b, i) => {
      const o = old.blocks[i];
      if (!o || o.kind !== b.kind) return;
      if (b.kind === "grid" && o.kind === "grid") {
        b.items.forEach((it, j) => urls.set(it.fig, o.items[j].src));
      } else if (b.kind === "image" && o.kind !== "grid") {
        urls.set(b.item.fig, o.item.src);
      }
    });
  }
  return urls;
}

async function main() {
  const project = CHILI_PROJECTS.find((p) => p.slug === slug);
  if (!project || !mediaDir) {
    throw new Error(
      `Usage: <slug> --media <dir>. Slugs: ${CHILI_PROJECTS.map((p) => p.slug).join(", ")}`,
    );
  }

  const saved = await prisma.project.findUnique({ where: { slug: project.slug } });
  const urls = reupload ? new Map<string, string>() : knownUrls(project.sections, project.cover, saved);

  const dir = mediaDir;
  const utapi = new UTApi();
  const resolve = async (f: Fig) => {
    let src = urls.get(f.fig);
    if (!src) {
      src = await upload(utapi, dir, f.fig);
      urls.set(f.fig, src);
      console.log(`uploaded ${f.fig}`);
    }
    return { src, alt: f.alt };
  };

  const coverImage = (await resolve(project.cover)).src;
  const sections: Section[] = [];
  for (const s of project.sections) {
    if (s.type !== "gallery") {
      sections.push(s);
      continue;
    }
    const blocks: GalleryBlock[] = [];
    for (const b of s.blocks) {
      blocks.push(
        b.kind === "grid"
          ? { kind: "grid", items: [await resolve(b.items[0]), await resolve(b.items[1])] }
          : { kind: "image", item: await resolve(b.item) },
      );
    }
    sections.push({ id: s.id, type: "gallery", blocks });
  }

  const data = {
    title: project.title,
    client: project.client,
    category: project.category,
    summary: project.summary,
    content: project.content,
    coverImage,
    websiteUrl: project.websiteUrl ?? null,
    sections: cleanSections(SectionsSchema.parse(sections)),
    year: project.year,
    featured: project.featured,
    order: project.order,
    published: true,
  };

  const row = await prisma.project.upsert({
    where: { slug: project.slug },
    update: data,
    create: { slug: project.slug, ...data },
  });
  console.log(`${saved ? "updated" : "created"} project #${row.id} ${row.slug} (${data.sections.length} sections)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

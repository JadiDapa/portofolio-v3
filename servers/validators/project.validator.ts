import { z } from "zod";
import { optionalUrl } from "./common";

export const GalleryItemSchema = z.object({
  src: z.string().min(1),
  alt: z.string().optional(),
});

export const GalleryBlockSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("grid"),
    items: z.array(GalleryItemSchema).length(2),
  }),
  z.object({ kind: z.literal("image"), item: GalleryItemSchema }),
  z.object({ kind: z.literal("video"), item: GalleryItemSchema }),
]);

export const GallerySchema = z.array(GalleryBlockSchema);

export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type GalleryBlock = z.infer<typeof GalleryBlockSchema>;

/** Drops blocks that still have an empty media slot (unfinished in the editor). */
export function cleanGallery(blocks: GalleryBlock[] | undefined): GalleryBlock[] {
  return (blocks ?? []).filter((b) =>
    b.kind === "grid" ? b.items.every((i) => i.src) : !!b.item.src,
  );
}

/**
 * A project page is an ordered list of sections. `hero` and `intro` read the
 * project's own fields (cover/video, title, summary, description, website);
 * the rest carry their own content so they can be repeated and reordered.
 */
export const SectionSchema = z.discriminatedUnion("type", [
  z.object({ id: z.string(), type: z.literal("hero") }),
  z.object({ id: z.string(), type: z.literal("intro") }),
  z.object({
    id: z.string(),
    type: z.literal("gallery"),
    blocks: z.array(GalleryBlockSchema),
  }),
  z.object({
    id: z.string(),
    type: z.literal("features"),
    title: z.string().optional(),
    items: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  z.object({
    id: z.string(),
    type: z.literal("tools"),
    title: z.string().optional(),
    items: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal("results"),
    title: z.string().optional(),
    items: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
  z.object({
    id: z.string(),
    type: z.literal("text"),
    title: z.string().optional(),
    body: z.string(),
  }),
]);

export const SectionsSchema = z.array(SectionSchema);

export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section["type"];

const newId = () => Math.random().toString(36).slice(2, 10);

/** Hero → intro → images: what every project looked like before sections existed. */
export function defaultSections(gallery: GalleryBlock[] = []): Section[] {
  const sections: Section[] = [
    { id: newId(), type: "hero" },
    { id: newId(), type: "intro" },
  ];
  if (gallery.length) sections.push({ id: newId(), type: "gallery", blocks: gallery });
  return sections;
}

/** Saved sections if there are any, otherwise the default arrangement from the legacy gallery. */
export function resolveSections(project: {
  sections?: unknown;
  gallery?: unknown;
}): Section[] {
  const saved = SectionsSchema.safeParse(project.sections);
  if (saved.success && saved.data.length) return saved.data;
  const gallery = GallerySchema.safeParse(project.gallery);
  return defaultSections(gallery.success ? gallery.data : []);
}

/** Drops empty rows/sections (unfinished in the editor) before saving. */
export function cleanSections(sections: Section[] | undefined): Section[] {
  const out: Section[] = [];
  for (const s of sections ?? []) {
    const title = s.type === "hero" || s.type === "intro" || s.type === "gallery" ? undefined : s.title?.trim() || undefined;
    switch (s.type) {
      case "gallery": {
        const blocks = cleanGallery(s.blocks);
        if (blocks.length) out.push({ ...s, blocks });
        break;
      }
      case "features": {
        const items = s.items
          .map((i) => ({ title: i.title.trim(), description: i.description.trim() }))
          .filter((i) => i.title);
        if (items.length) out.push({ ...s, title, items });
        break;
      }
      case "tools": {
        const items = s.items.map((i) => i.trim()).filter(Boolean);
        if (items.length) out.push({ ...s, title, items });
        break;
      }
      case "results": {
        const items = s.items
          .map((i) => ({ value: i.value.trim(), label: i.label.trim() }))
          .filter((i) => i.value);
        if (items.length) out.push({ ...s, title, items });
        break;
      }
      case "text":
        if (s.body.trim()) out.push({ ...s, title, body: s.body.trim() });
        break;
      default:
        out.push(s);
    }
  }
  return out;
}

const ProjectBaseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  client: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().optional(),
  coverImage: z.string().nullish(),
  heroVideo: z.string().nullish(),
  websiteUrl: optionalUrl.nullish(),
  gallery: GallerySchema.optional(),
  sections: SectionsSchema.default([]),
  year: z.number().int().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const CreateProjectSchema = ProjectBaseSchema;
export const UpdateProjectSchema = ProjectBaseSchema.partial();

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;

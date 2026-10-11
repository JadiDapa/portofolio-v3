import prisma from "@/lib/prisma";

export type SearchEntry = {
  group: "Work" | "Journal" | "Services";
  title: string;
  href: string;
};

/** Lightweight title/slug index behind the dashboard ⌘K palette. */
export const SearchService = {
  async index(): Promise<SearchEntry[]> {
    const [projects, posts, services] = await Promise.all([
      prisma.project.findMany({
        select: { title: true, slug: true },
        orderBy: { id: "desc" },
        take: 200,
      }),
      prisma.post.findMany({
        select: { title: true, slug: true },
        orderBy: { id: "desc" },
        take: 200,
      }),
      prisma.service.findMany({
        select: { title: true, slug: true },
        orderBy: { order: "asc" },
        take: 100,
      }),
    ]);

    return [
      ...projects.map((p) => ({
        group: "Work" as const,
        title: p.title,
        href: `/dashboard/projects/update/${p.slug}`,
      })),
      ...posts.map((p) => ({
        group: "Journal" as const,
        title: p.title,
        href: `/dashboard/posts/update/${p.slug}`,
      })),
      ...services.map((s) => ({
        group: "Services" as const,
        title: s.title,
        href: `/dashboard/services/update/${s.slug}`,
      })),
    ];
  },
};

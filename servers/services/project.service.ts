import { Prisma } from "@/generated/prisma";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  resolveSections,
} from "../validators/project.validator";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { toSlug } from "../validators/common";
import { uniqueViolation } from "./errors";

/** The slim shape public project grids render. */
export const projectCardSelect = {
  id: true,
  title: true,
  slug: true,
  category: true,
  coverImage: true,
} satisfies Prisma.ProjectSelect;

export type ProjectCard = Prisma.ProjectGetPayload<{ select: typeof projectCardSelect }>;

/** Featured first, then the manual `order`, then newest (by year, then when it was added). */
const PROJECT_ORDER: Prisma.ProjectOrderByWithRelationInput[] = [
  { featured: "desc" },
  { order: "asc" },
  { year: { sort: "desc", nulls: "last" } },
  { createdAt: "desc" },
];

function shuffle<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type ProjectListOptions = {
  page?: number;
  pageSize?: number;
  published?: boolean;
  featured?: boolean;
  category?: string;
  orderBy?: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[];
};

function projectWhere(opts: ProjectListOptions): Prisma.ProjectWhereInput {
  const and: Prisma.ProjectWhereInput[] = [];

  if (opts.published !== undefined) and.push({ published: opts.published });
  if (opts.featured !== undefined) and.push({ featured: opts.featured });
  if (opts.category) and.push({ category: opts.category });

  return and.length ? { AND: and } : {};
}

export const ProjectService = {
  async list(opts: ProjectListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = projectWhere(opts);
    const orderBy = opts.orderBy ?? PROJECT_ORDER;

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.project.findMany({ orderBy: PROJECT_ORDER });
  },

  /** Published projects as slim cards in display order (see PROJECT_ORDER), optionally featured only. */
  async listCards(opts: { featured?: boolean; category?: string; take?: number } = {}) {
    return await prisma.project.findMany({
      where: {
        published: true,
        ...(opts.featured !== undefined && { featured: opts.featured }),
        ...(opts.category && { category: opts.category }),
      },
      orderBy: PROJECT_ORDER,
      take: opts.take,
      select: projectCardSelect,
    });
  },

  async count() {
    return await prisma.project.count();
  },

  async getById(id: number) {
    return await prisma.project.findUnique({ where: { id } });
  },

  /** Memoised per request so `generateMetadata` and the page share one query. */
  getBySlug: cache(async (slug: string) => {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) return null;
    return { ...project, sections: resolveSections(project) };
  }),

  /** Up to `take` random published projects, excluding `excludeIds`. */
  async getRelated(excludeIds: number[], take = 2) {
    const rows = await prisma.project.findMany({
      where: { published: true, id: { notIn: excludeIds } },
      select: { id: true },
    });
    const ids = shuffle(rows.map((r) => r.id)).slice(0, take);
    if (ids.length === 0) return [];
    return prisma.project.findMany({
      where: { id: { in: ids } },
      select: projectCardSelect,
    });
  },

  async create(data: CreateProjectDTO) {
    const slug = data.slug || toSlug(data.title);
    return prisma.project.create({ data: { ...data, slug } }).catch(uniqueViolation("project"));
  },

  async update(id: number, data: UpdateProjectDTO) {
    return prisma.project.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.project.delete({ where: { id } });
  },

  async setPublishedMany(ids: number[], published: boolean) {
    return prisma.project.updateMany({ where: { id: { in: ids } }, data: { published } });
  },

  async deleteMany(ids: number[]) {
    return prisma.project.deleteMany({ where: { id: { in: ids } } });
  },
};

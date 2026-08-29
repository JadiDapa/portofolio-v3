import { Prisma } from "@/generated/prisma";
import { CreateProjectDTO, UpdateProjectDTO } from "../validators/project.validator";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export type ProjectListOptions = {
  page?: number;
  pageSize?: number;
  published?: boolean;
  featured?: boolean;
  category?: string;
  orderBy?: Prisma.ProjectOrderByWithRelationInput;
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
    const orderBy: Prisma.ProjectOrderByWithRelationInput = opts.orderBy ?? { id: "desc" };

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
    return await prisma.project.findMany({ orderBy: { id: "desc" } });
  },

  async getById(id: number) {
    return await prisma.project.findUnique({ where: { id } });
  },

  async getBySlug(slug: string) {
    return await prisma.project.findUnique({ where: { slug } });
  },

  async create(data: CreateProjectDTO) {
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    return prisma.project.create({ data: { ...data, slug } });
  },

  async update(id: number, data: UpdateProjectDTO) {
    return prisma.project.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.project.delete({ where: { id } });
  },
};

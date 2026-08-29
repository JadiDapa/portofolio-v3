import { Prisma } from "@/generated/prisma";
import { CreatePostDTO, UpdatePostDTO } from "../validators/post.validator";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export type PostListOptions = {
  page?: number;
  pageSize?: number;
  published?: boolean;
  authorId?: number;
  orderBy?: Prisma.PostOrderByWithRelationInput;
};

function postWhere(opts: PostListOptions): Prisma.PostWhereInput {
  const and: Prisma.PostWhereInput[] = [];

  if (opts.published !== undefined) and.push({ published: opts.published });
  if (opts.authorId) and.push({ authorId: opts.authorId });

  return and.length ? { AND: and } : {};
}

export const PostService = {
  async list(opts: PostListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = postWhere(opts);
    const orderBy: Prisma.PostOrderByWithRelationInput = opts.orderBy ?? { id: "desc" };

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        include: { author: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.post.findMany({
      orderBy: { id: "desc" },
      include: { author: true },
    });
  },

  async getById(id: number) {
    return await prisma.post.findUnique({ where: { id } });
  },

  async getBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });
  },

  async create(data: CreatePostDTO) {
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    return prisma.post.create({ data: { ...data, slug } });
  },

  async update(id: number, data: UpdatePostDTO) {
    return prisma.post.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.post.delete({ where: { id } });
  },
};

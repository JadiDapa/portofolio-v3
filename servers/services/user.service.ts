import prisma from "@/lib/prisma";
import { CreateUserDTO, UpdateUserDTO } from "../validators/user.validator";
import { Prisma, Role } from "@/generated/prisma";

export type UserListOptions = {
  page?: number;
  pageSize?: number;
  role?: Role;
  search?: string;
  orderBy?: Prisma.UserOrderByWithRelationInput;
};

function userWhere(opts: UserListOptions): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (opts.role) where.role = opts.role;

  const q = opts.search?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export const UserService = {
  async list(opts: UserListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = userWhere(opts);
    const orderBy: Prisma.UserOrderByWithRelationInput = opts.orderBy ?? { id: "desc" };

    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.user.findMany({ orderBy: { id: "desc" } });
  },

  async getById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  },

  async getByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  },

  async getByRole(role: Role) {
    return await prisma.user.findMany({ where: { role } });
  },

  async create(data: CreateUserDTO) {
    return await prisma.user.create({ data });
  },

  async update(id: number, data: UpdateUserDTO) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};

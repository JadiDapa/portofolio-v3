import { CreateServiceDTO, UpdateServiceDTO } from "../validators/service.validator";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { toSlug } from "../validators/common";
import { uniqueViolation } from "./errors";

export const ServiceService = {
  async getAll() {
    return await prisma.service.findMany({ orderBy: { order: "asc" } });
  },

  /** Rewrites `order` to match the position of each id in the list. */
  async reorder(ids: number[]) {
    return prisma.$transaction(
      ids.map((id, order) => prisma.service.update({ where: { id }, data: { order } })),
    );
  },

  async getById(id: number) {
    return await prisma.service.findUnique({ where: { id } });
  },

  /** Memoised per request so `generateMetadata` and the page share one query. */
  getBySlug: cache(async (slug: string) => {
    return await prisma.service.findUnique({ where: { slug } });
  }),

  async create(data: CreateServiceDTO) {
    const slug = data.slug || toSlug(data.title);
    return prisma.service.create({ data: { ...data, slug } }).catch(uniqueViolation("service"));
  },

  async deleteMany(ids: number[]) {
    return prisma.service.deleteMany({ where: { id: { in: ids } } });
  },

  async update(id: number, data: UpdateServiceDTO) {
    return prisma.service.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};

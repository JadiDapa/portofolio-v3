import { CreateServiceDTO, UpdateServiceDTO } from "../validators/service.validator";
import prisma from "@/lib/prisma";
import slugify from "slugify";

export const ServiceService = {
  async getAll() {
    return await prisma.service.findMany({ orderBy: { order: "asc" } });
  },

  async getById(id: number) {
    return await prisma.service.findUnique({ where: { id } });
  },

  async getBySlug(slug: string) {
    return await prisma.service.findUnique({ where: { slug } });
  },

  async create(data: CreateServiceDTO) {
    const slug = data.slug || slugify(data.title, { lower: true, strict: true });
    return prisma.service.create({ data: { ...data, slug } });
  },

  async update(id: number, data: UpdateServiceDTO) {
    return prisma.service.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};

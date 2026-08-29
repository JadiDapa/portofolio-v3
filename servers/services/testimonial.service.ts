import {
  CreateTestimonialDTO,
  UpdateTestimonialDTO,
} from "../validators/testimonial.validator";
import prisma from "@/lib/prisma";

export const TestimonialService = {
  async getAll() {
    return await prisma.testimonial.findMany({ orderBy: { id: "desc" } });
  },

  async getPublished(limit?: number) {
    return await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { id: "desc" },
      take: limit,
    });
  },

  async getById(id: number) {
    return await prisma.testimonial.findUnique({ where: { id } });
  },

  async create(data: CreateTestimonialDTO) {
    return prisma.testimonial.create({ data });
  },

  async update(id: number, data: UpdateTestimonialDTO) {
    return prisma.testimonial.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.testimonial.delete({ where: { id } });
  },
};

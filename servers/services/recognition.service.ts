import {
  CreateRecognitionDTO,
  UpdateRecognitionDTO,
} from "../validators/recognition.validator";
import prisma from "@/lib/prisma";

export const RecognitionService = {
  async getAll() {
    return await prisma.recognition.findMany({
      orderBy: [{ order: "asc" }, { id: "desc" }],
    });
  },

  /** Rewrites `order` to match the position of each id in the list. */
  async reorder(ids: number[]) {
    return prisma.$transaction(
      ids.map((id, order) =>
        prisma.recognition.update({ where: { id }, data: { order } }),
      ),
    );
  },

  async getPublished() {
    return await prisma.recognition.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { id: "desc" }],
    });
  },

  async getById(id: number) {
    return await prisma.recognition.findUnique({ where: { id } });
  },

  async create(data: CreateRecognitionDTO) {
    return prisma.recognition.create({ data: { ...data, url: data.url || null } });
  },

  async update(id: number, data: UpdateRecognitionDTO) {
    return prisma.recognition.update({
      where: { id },
      data: data.url === undefined ? data : { ...data, url: data.url || null },
    });
  },

  async delete(id: number) {
    return prisma.recognition.delete({ where: { id } });
  },
};

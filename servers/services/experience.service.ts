import {
  CreateExperienceDTO,
  UpdateExperienceDTO,
} from "../validators/experience.validator";
import prisma from "@/lib/prisma";

export const ExperienceService = {
  async getAll() {
    return await prisma.experience.findMany({
      orderBy: [{ startDate: "desc" }, { order: "asc" }],
    });
  },

  async getById(id: number) {
    return await prisma.experience.findUnique({ where: { id } });
  },

  async create(data: CreateExperienceDTO) {
    return prisma.experience.create({ data });
  },

  async update(id: number, data: UpdateExperienceDTO) {
    return prisma.experience.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.experience.delete({ where: { id } });
  },
};

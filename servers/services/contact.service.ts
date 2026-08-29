import { CreateContactSubmissionDTO } from "../validators/contact.validator";
import prisma from "@/lib/prisma";

export const ContactService = {
  async getAll() {
    return await prisma.contactSubmission.findMany({ orderBy: { id: "desc" } });
  },

  async create(data: Omit<CreateContactSubmissionDTO, "consent">) {
    return prisma.contactSubmission.create({ data });
  },

  async markRead(id: number, read: boolean) {
    return prisma.contactSubmission.update({ where: { id }, data: { read } });
  },

  async delete(id: number) {
    return prisma.contactSubmission.delete({ where: { id } });
  },
};

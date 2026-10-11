import { CreateContactSubmissionDTO } from "../validators/contact.validator";
import prisma from "@/lib/prisma";

export const ContactService = {
  async getAll() {
    return await prisma.contactSubmission.findMany({ orderBy: { id: "desc" } });
  },

  async countUnread() {
    return await prisma.contactSubmission.count({ where: { read: false } });
  },

  /** Inquiries received per month for the last `months` months, oldest first. */
  async countByMonth(months = 12) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    const rows = await prisma.contactSubmission.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true },
    });

    const buckets = Array.from({ length: months }, (_, i) => {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      return { year: d.getFullYear(), month: d.getMonth(), count: 0 };
    });

    for (const { createdAt } of rows) {
      const b = buckets.find(
        (x) =>
          x.year === createdAt.getFullYear() && x.month === createdAt.getMonth(),
      );
      if (b) b.count++;
    }

    return buckets;
  },

  async create(data: Omit<CreateContactSubmissionDTO, "consent" | "formType">) {
    return prisma.contactSubmission.create({ data });
  },

  async markRead(id: number, read: boolean) {
    return prisma.contactSubmission.update({ where: { id }, data: { read } });
  },

  async delete(id: number) {
    return prisma.contactSubmission.delete({ where: { id } });
  },
};

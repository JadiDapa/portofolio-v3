import { z } from "zod";

const ServiceBaseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  order: z.number().int().default(0),
});

export const CreateServiceSchema = ServiceBaseSchema;
export const UpdateServiceSchema = ServiceBaseSchema.partial();

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;

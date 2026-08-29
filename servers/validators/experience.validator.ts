import { z } from "zod";

const ExperienceBaseSchema = z.object({
  type: z.enum(["WORK", "EDUCATION"]),
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  order: z.number().int().default(0),
});

export const CreateExperienceSchema = ExperienceBaseSchema;
export const UpdateExperienceSchema = ExperienceBaseSchema.partial();

export type CreateExperienceDTO = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDTO = z.infer<typeof UpdateExperienceSchema>;

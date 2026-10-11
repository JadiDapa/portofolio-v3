import { z } from "zod";

const ExperienceBaseSchema = z.object({
  type: z.enum(["WORK", "ORGANIZATION", "EDUCATION"]),
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  startDate: z.coerce.date({ error: "Start date is required" }),
  // A cleared date input arrives as "", which means "no end date"
  endDate: z.preprocess((v) => (v === "" ? null : v), z.coerce.date().nullish()),
  order: z.number().int().default(0),
});

export const CreateExperienceSchema = ExperienceBaseSchema;
export const UpdateExperienceSchema = ExperienceBaseSchema.partial();

export type CreateExperienceDTO = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDTO = z.infer<typeof UpdateExperienceSchema>;

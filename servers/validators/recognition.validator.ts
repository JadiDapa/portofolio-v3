import { z } from "zod";

const RecognitionBaseSchema = z.object({
  source: z.string().min(1, "Source is required"),
  kind: z.enum(["AWARD", "PRESS", "CERTIFICATION", "COMPETITION"]),
  title: z.string().min(1, "Title is required"),
  url: z.union([z.url("Must be a valid URL"), z.literal("")]).optional(),
  year: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.number().int().min(1900).max(2100).optional(),
  ),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const CreateRecognitionSchema = RecognitionBaseSchema;
export const UpdateRecognitionSchema = RecognitionBaseSchema.partial();

export type CreateRecognitionDTO = z.infer<typeof CreateRecognitionSchema>;
export type UpdateRecognitionDTO = z.infer<typeof UpdateRecognitionSchema>;

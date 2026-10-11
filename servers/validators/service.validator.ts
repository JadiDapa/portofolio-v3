import { z } from "zod";

export const ProcessStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required"),
  outcomes: z.array(z.string().min(1)),
});

export const FaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export type ProcessStep = z.infer<typeof ProcessStepSchema>;
export type Faq = z.infer<typeof FaqSchema>;

/** Reads a Json column back as a typed list, dropping anything malformed. */
export function parseList<T>(schema: z.ZodType<T>, value: unknown): T[] {
  const parsed = z.array(schema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

const ServiceBaseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().optional(),
  media: z.string().nullish(),
  /** Intro heading; wrap one word in *asterisks* to extrude it. */
  headline: z.string().nullish(),
  lead: z.string().nullish(),
  process: z.array(ProcessStepSchema).optional(),
  faqs: z.array(FaqSchema).optional(),
  order: z.number().int().default(0),
});

export const CreateServiceSchema = ServiceBaseSchema;
export const UpdateServiceSchema = ServiceBaseSchema.partial();

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;

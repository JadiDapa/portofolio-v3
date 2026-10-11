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

export const SkillSchema = z.object({
  /** Editor-only key for drag-reorder; stripped by cleanSkills. */
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  summary: z.string().optional(),
  tools: z.array(z.string()),
});

export type ProcessStep = z.infer<typeof ProcessStepSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Skill = z.infer<typeof SkillSchema>;

/** Reads a Json column back as a typed list, dropping anything malformed. */
export function parseList<T>(schema: z.ZodType<T>, value: unknown): T[] {
  const parsed = z.array(schema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

/** Drops blank outcomes and steps the editor left empty. */
export function cleanProcess(steps: ProcessStep[] | undefined): ProcessStep[] {
  return (steps ?? [])
    .map((s) => ({
      title: s.title.trim(),
      text: s.text.trim(),
      outcomes: s.outcomes.map((o) => o.trim()).filter(Boolean),
    }))
    .filter((s) => s.title && s.text);
}

export function cleanFaqs(faqs: Faq[] | undefined): Faq[] {
  return (faqs ?? [])
    .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    .filter((f) => f.question && f.answer);
}

/** Trims, drops nameless skills and blank or repeated tools (case-insensitive). */
export function cleanSkills(skills: Skill[] | undefined): Skill[] {
  return (skills ?? [])
    .map((s) => {
      const seen = new Set<string>();
      const tools = s.tools
        .map((t) => t.trim())
        .filter((t) => {
          const key = t.toLowerCase();
          if (!t || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      return { name: s.name.trim(), summary: s.summary?.trim() || undefined, tools };
    })
    .filter((s) => s.name);
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
  skills: z.array(SkillSchema).optional(),
  order: z.number().int().default(0),
});

export const CreateServiceSchema = ServiceBaseSchema;
export const UpdateServiceSchema = ServiceBaseSchema.partial();

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;

import { z } from "zod";

const TestimonialBaseSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  authorName: z.string().min(1, "Author name is required"),
  authorTitle: z.string().optional(),
  company: z.string().optional(),
  published: z.boolean().default(true),
});

export const CreateTestimonialSchema = TestimonialBaseSchema;
export const UpdateTestimonialSchema = TestimonialBaseSchema.partial();

export type CreateTestimonialDTO = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialDTO = z.infer<typeof UpdateTestimonialSchema>;

import { z } from "zod";

export const CreateContactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  projectTypes: z.array(z.string()).default([]),
  consent: z
    .boolean()
    .refine((v) => v === true, "Please agree to the processing of your data"),
});

export type CreateContactSubmissionDTO = z.infer<
  typeof CreateContactSubmissionSchema
>;

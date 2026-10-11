import { z } from "zod";

export const CONTACT_FORM_TYPES = ["enquiry", "general"] as const;
export type ContactFormType = (typeof CONTACT_FORM_TYPES)[number];

export const CreateContactSubmissionSchema = z
  .object({
    formType: z.enum(CONTACT_FORM_TYPES).default("enquiry"),
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    email: z.string().email("Enter a valid email"),
    timeline: z.string().optional(),
    budget: z.string().optional(),
    message: z
      .string()
      .min(1, "Message is required")
      .max(1000, "Keep it under 1000 characters"),
    projectTypes: z.array(z.string()).default([]),
    consent: z
      .boolean()
      .refine((v) => v === true, "Please agree to the processing of your data"),
  })
  .superRefine((data, ctx) => {
    // Timeline and budget only apply to project enquiries
    if (data.formType !== "enquiry") return;
    if (!data.timeline?.trim())
      ctx.addIssue({ code: "custom", path: ["timeline"], message: "Timeline is required" });
    if (!data.budget?.trim())
      ctx.addIssue({ code: "custom", path: ["budget"], message: "Budget is required" });
  });

export type CreateContactSubmissionDTO = z.infer<
  typeof CreateContactSubmissionSchema
>;

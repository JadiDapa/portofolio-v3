"use server";

import { revalidatePath } from "next/cache";
import { CreateContactSubmissionSchema } from "@/servers/validators/contact.validator";
import { ContactService } from "@/servers/services/contact.service";
import z from "zod";

export async function submitContactForm(
  input: z.input<typeof CreateContactSubmissionSchema>,
) {
  const parsed = CreateContactSubmissionSchema.parse(input);
  const enquiry = parsed.formType === "enquiry";
  await ContactService.create({
    name: parsed.name,
    company: enquiry ? parsed.company : undefined,
    email: parsed.email,
    timeline: enquiry ? parsed.timeline : undefined,
    budget: enquiry ? parsed.budget : undefined,
    message: parsed.message,
    projectTypes: enquiry ? parsed.projectTypes : [],
  });
  revalidatePath("/dashboard/inquiries");
}

export async function markInquiryRead(id: number, read: boolean) {
  await ContactService.markRead(id, read);
  revalidatePath("/dashboard/inquiries");
}

export async function deleteInquiry(id: number) {
  await ContactService.delete(id);
  revalidatePath("/dashboard/inquiries");
}

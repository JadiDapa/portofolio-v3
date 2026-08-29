"use server";

import { revalidatePath } from "next/cache";
import { CreateContactSubmissionSchema } from "@/servers/validators/contact.validator";
import { ContactService } from "@/servers/services/contact.service";
import z from "zod";

export async function submitContactForm(
  input: z.input<typeof CreateContactSubmissionSchema>,
) {
  const parsed = CreateContactSubmissionSchema.parse(input);
  await ContactService.create({
    name: parsed.name,
    company: parsed.company,
    email: parsed.email,
    timeline: parsed.timeline,
    budget: parsed.budget,
    message: parsed.message,
    projectTypes: parsed.projectTypes,
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

"use server";

import { revalidatePath } from "next/cache";
import { CreateContactSubmissionSchema } from "@/servers/validators/contact.validator";
import { ContactService } from "@/servers/services/contact.service";
import { requireAdmin } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import z from "zod";

/** Public: the contact form. */
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

  // The inquiry is already saved; a mail failure must not fail the form.
  try {
    await sendMail({
      subject: `New ${parsed.formType} from ${parsed.name}`,
      replyTo: parsed.email,
      text: [
        `Name: ${parsed.name}`,
        `Email: ${parsed.email}`,
        enquiry && parsed.company ? `Company: ${parsed.company}` : null,
        enquiry ? `Timeline: ${parsed.timeline}` : null,
        enquiry ? `Budget: ${parsed.budget}` : null,
        enquiry && parsed.projectTypes.length
          ? `Project types: ${parsed.projectTypes.join(", ")}`
          : null,
        "",
        parsed.message,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }
}

export async function markInquiryRead(id: number, read: boolean) {
  await requireAdmin();
  await ContactService.markRead(id, read);
  revalidatePath("/dashboard/inquiries");
}

export async function deleteInquiry(id: number) {
  await requireAdmin();
  await ContactService.delete(id);
  revalidatePath("/dashboard/inquiries");
}

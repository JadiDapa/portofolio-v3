"use server";

import { revalidatePath } from "next/cache";
import {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
} from "@/servers/validators/testimonial.validator";
import { TestimonialService } from "@/servers/services/testimonial.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(
  input: z.input<typeof CreateTestimonialSchema>,
) {
  await requireAdmin();
  const data = CreateTestimonialSchema.parse(input);
  await TestimonialService.create(data);
  revalidate();
}

export async function updateTestimonial(
  testimonialId: number,
  input: z.input<typeof UpdateTestimonialSchema>,
) {
  await requireAdmin();
  const data = UpdateTestimonialSchema.parse(input);
  await TestimonialService.update(testimonialId, data);
  revalidate();
}

export async function deleteTestimonial(testimonialId: number) {
  await requireAdmin();
  await TestimonialService.delete(testimonialId);
  revalidate();
}

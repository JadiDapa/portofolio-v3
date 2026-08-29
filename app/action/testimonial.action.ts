"use server";

import { revalidatePath } from "next/cache";
import {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
} from "@/servers/validators/testimonial.validator";
import { TestimonialService } from "@/servers/services/testimonial.service";
import z from "zod";

export async function createTestimonial(
  input: z.input<typeof CreateTestimonialSchema>,
) {
  const data = CreateTestimonialSchema.parse(input);
  await TestimonialService.create(data);
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(
  testimonialId: number,
  input: z.input<typeof UpdateTestimonialSchema>,
) {
  const data = UpdateTestimonialSchema.parse(input);
  await TestimonialService.update(testimonialId, data);
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(testimonialId: number) {
  await TestimonialService.delete(testimonialId);
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/");
}

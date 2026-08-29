"use server";

import { revalidatePath } from "next/cache";
import {
  CreateExperienceSchema,
  UpdateExperienceSchema,
} from "@/servers/validators/experience.validator";
import { ExperienceService } from "@/servers/services/experience.service";
import z from "zod";

export async function createExperience(
  input: z.input<typeof CreateExperienceSchema>,
) {
  const data = CreateExperienceSchema.parse(input);
  await ExperienceService.create(data);
  revalidatePath("/dashboard/experience");
  revalidatePath("/about");
}

export async function updateExperience(
  experienceId: number,
  input: z.input<typeof UpdateExperienceSchema>,
) {
  const data = UpdateExperienceSchema.parse(input);
  await ExperienceService.update(experienceId, data);
  revalidatePath("/dashboard/experience");
  revalidatePath("/about");
}

export async function deleteExperience(experienceId: number) {
  await ExperienceService.delete(experienceId);
  revalidatePath("/dashboard/experience");
  revalidatePath("/about");
}

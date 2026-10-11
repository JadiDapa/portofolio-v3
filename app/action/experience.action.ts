"use server";

import { revalidatePath } from "next/cache";
import {
  CreateExperienceSchema,
  UpdateExperienceSchema,
} from "@/servers/validators/experience.validator";
import { ExperienceService } from "@/servers/services/experience.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

// Experience is no longer rendered on a public page, so only the dashboard list is stale.
function revalidate() {
  revalidatePath("/dashboard/experience");
}

export async function createExperience(
  input: z.input<typeof CreateExperienceSchema>,
) {
  await requireAdmin();
  const data = CreateExperienceSchema.parse(input);
  await ExperienceService.create(data);
  revalidate();
}

export async function updateExperience(
  experienceId: number,
  input: z.input<typeof UpdateExperienceSchema>,
) {
  await requireAdmin();
  const data = UpdateExperienceSchema.parse(input);
  await ExperienceService.update(experienceId, data);
  revalidate();
}

export async function deleteExperience(experienceId: number) {
  await requireAdmin();
  await ExperienceService.delete(experienceId);
  revalidate();
}

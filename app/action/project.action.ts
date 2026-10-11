"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/servers/validators/project.validator";
import { ProjectService } from "@/servers/services/project.service";
import z from "zod";

export async function createProject(
  input: z.input<typeof CreateProjectSchema>,
) {
  const data = CreateProjectSchema.parse(input);
  await ProjectService.create(data);
  revalidatePath("/dashboard/projects");
  revalidatePath("/work");
}

export async function updateProject(
  projectId: number,
  input: z.input<typeof UpdateProjectSchema>,
) {
  const data = UpdateProjectSchema.parse(input);
  await ProjectService.update(projectId, data);
  revalidatePath("/dashboard/projects");
  revalidatePath("/work");
}

export async function deleteProject(projectId: number) {
  await ProjectService.delete(projectId);
  revalidatePath("/dashboard/projects");
  revalidatePath("/work");
}

/** Two random projects other than the current page, preferring ones not on screen already. */
export async function getRelatedProjects(
  projectId: number,
  currentIds: number[],
) {
  const fresh = await ProjectService.getRelated([projectId, ...currentIds], 2);
  if (fresh.length === 2) return fresh;
  return ProjectService.getRelated([projectId], 2);
}

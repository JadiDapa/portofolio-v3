"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/servers/validators/project.validator";
import { ProjectService } from "@/servers/services/project.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
}

export async function createProject(
  input: z.input<typeof CreateProjectSchema>,
) {
  await requireAdmin();
  const data = CreateProjectSchema.parse(input);
  await ProjectService.create(data);
  revalidate();
}

export async function updateProject(
  projectId: number,
  input: z.input<typeof UpdateProjectSchema>,
) {
  await requireAdmin();
  const data = UpdateProjectSchema.parse(input);
  await ProjectService.update(projectId, data);
  revalidate();
}

const Ids = z.array(z.number().int()).min(1).max(500);

export async function setProjectsPublished(ids: number[], published: boolean) {
  await requireAdmin();
  await ProjectService.setPublishedMany(Ids.parse(ids), published);
  revalidate();
}

export async function deleteProjects(ids: number[]) {
  await requireAdmin();
  await ProjectService.deleteMany(Ids.parse(ids));
  revalidate();
}

export async function deleteProject(projectId: number) {
  await requireAdmin();
  await ProjectService.delete(projectId);
  revalidate();
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

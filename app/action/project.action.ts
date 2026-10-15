"use server";

import { revalidatePath } from "next/cache";
import {
  CreateProjectSchema,
  MAX_RELATED,
  RELATED_FILL,
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
const RelatedIds = z.array(z.number().int()).max(MAX_RELATED);

/** Saves the dashboard table's drag/arrow order: `ids` is every project, top to bottom. */
export async function reorderProjects(ids: number[]) {
  await requireAdmin();
  await ProjectService.reorder(Ids.parse(ids));
  revalidate();
}

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

/**
 * Random projects to fill Related Work up to RELATED_FILL next to the hand-picked ones,
 * preferring ones not on screen already. Nothing when two or more were picked.
 */
export async function getRelatedProjects(
  projectId: number,
  pickedIds: number[],
  currentIds: number[],
) {
  const picked = RelatedIds.parse(pickedIds);
  const take = RELATED_FILL - picked.length;
  if (take <= 0) return [];

  const keep = [projectId, ...picked];
  const fresh = await ProjectService.getRelated([...keep, ...RelatedIds.parse(currentIds)], take);
  if (fresh.length === take) return fresh;
  return ProjectService.getRelated(keep, take);
}

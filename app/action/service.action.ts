"use server";

import { revalidatePath } from "next/cache";
import {
  CreateServiceSchema,
  UpdateServiceSchema,
} from "@/servers/validators/service.validator";
import { ServiceService } from "@/servers/services/service.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/services");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/work");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
}

export async function createService(
  input: z.input<typeof CreateServiceSchema>,
) {
  await requireAdmin();
  const data = CreateServiceSchema.parse(input);
  await ServiceService.create(data);
  revalidate();
}

export async function deleteServices(ids: number[]) {
  await requireAdmin();
  const list = z.array(z.number().int()).min(1).max(500).parse(ids);
  await ServiceService.deleteMany(list);
  revalidate();
}

export async function reorderServices(ids: number[]) {
  await requireAdmin();
  const list = z.array(z.number().int()).parse(ids);
  await ServiceService.reorder(list);
  revalidate();
}

export async function updateService(
  serviceId: number,
  input: z.input<typeof UpdateServiceSchema>,
) {
  await requireAdmin();
  const data = UpdateServiceSchema.parse(input);
  await ServiceService.update(serviceId, data);
  revalidate();
}

export async function deleteService(serviceId: number) {
  await requireAdmin();
  await ServiceService.delete(serviceId);
  revalidate();
}

"use server";

import { revalidatePath } from "next/cache";
import {
  CreateServiceSchema,
  UpdateServiceSchema,
} from "@/servers/validators/service.validator";
import { ServiceService } from "@/servers/services/service.service";
import z from "zod";

export async function createService(
  input: z.input<typeof CreateServiceSchema>,
) {
  const data = CreateServiceSchema.parse(input);
  await ServiceService.create(data);
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
}

export async function updateService(
  serviceId: number,
  input: z.input<typeof UpdateServiceSchema>,
) {
  const data = UpdateServiceSchema.parse(input);
  await ServiceService.update(serviceId, data);
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
}

export async function deleteService(serviceId: number) {
  await ServiceService.delete(serviceId);
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
}

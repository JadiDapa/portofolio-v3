"use server";

import { revalidatePath } from "next/cache";
import {
  CreateRecognitionSchema,
  UpdateRecognitionSchema,
} from "@/servers/validators/recognition.validator";
import { RecognitionService } from "@/servers/services/recognition.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/recognition");
  revalidatePath("/about");
}

export async function createRecognition(
  input: z.input<typeof CreateRecognitionSchema>,
) {
  await requireAdmin();
  const data = CreateRecognitionSchema.parse(input);
  await RecognitionService.create(data);
  revalidate();
}

export async function updateRecognition(
  recognitionId: number,
  input: z.input<typeof UpdateRecognitionSchema>,
) {
  await requireAdmin();
  const data = UpdateRecognitionSchema.parse(input);
  await RecognitionService.update(recognitionId, data);
  revalidate();
}

export async function reorderRecognition(ids: number[]) {
  await requireAdmin();
  const list = z.array(z.number().int()).parse(ids);
  await RecognitionService.reorder(list);
  revalidate();
}

export async function deleteRecognition(recognitionId: number) {
  await requireAdmin();
  await RecognitionService.delete(recognitionId);
  revalidate();
}

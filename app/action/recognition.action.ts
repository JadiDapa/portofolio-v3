"use server";

import { revalidatePath } from "next/cache";
import {
  CreateRecognitionSchema,
  UpdateRecognitionSchema,
} from "@/servers/validators/recognition.validator";
import { RecognitionService } from "@/servers/services/recognition.service";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/recognition");
  revalidatePath("/about");
}

export async function createRecognition(
  input: z.input<typeof CreateRecognitionSchema>,
) {
  const data = CreateRecognitionSchema.parse(input);
  await RecognitionService.create(data);
  revalidate();
}

export async function updateRecognition(
  recognitionId: number,
  input: z.input<typeof UpdateRecognitionSchema>,
) {
  const data = UpdateRecognitionSchema.parse(input);
  await RecognitionService.update(recognitionId, data);
  revalidate();
}

export async function deleteRecognition(recognitionId: number) {
  await RecognitionService.delete(recognitionId);
  revalidate();
}

"use server";

import { revalidatePath } from "next/cache";
import {
  CreatePostSchema,
  UpdatePostSchema,
} from "@/servers/validators/post.validator";
import { PostService } from "@/servers/services/post.service";
import z from "zod";

export async function createPost(input: z.input<typeof CreatePostSchema>) {
  const data = CreatePostSchema.parse(input);
  await PostService.create(data);
  revalidatePath("/dashboard/posts");
}

export async function updatePost(
  postId: number,
  input: z.input<typeof UpdatePostSchema>,
) {
  const data = UpdatePostSchema.parse(input);
  await PostService.update(postId, data);
  revalidatePath("/dashboard/posts");
}

export async function deletePost(postId: number) {
  await PostService.delete(postId);
  revalidatePath("/dashboard/posts");
}

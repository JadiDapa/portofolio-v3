"use server";

import { revalidatePath } from "next/cache";
import {
  CreatePostSchema,
  UpdatePostSchema,
} from "@/servers/validators/post.validator";
import { PostService } from "@/servers/services/post.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/posts");
  revalidatePath("/journal");
  revalidatePath("/journal/[slug]", "page");
}

export async function createPost(input: z.input<typeof CreatePostSchema>) {
  await requireAdmin();
  const data = CreatePostSchema.parse(input);
  await PostService.create(data);
  revalidate();
}

export async function updatePost(
  postId: number,
  input: z.input<typeof UpdatePostSchema>,
) {
  await requireAdmin();
  const data = UpdatePostSchema.parse(input);
  await PostService.update(postId, data);
  revalidate();
}

const Ids = z.array(z.number().int()).min(1).max(500);

export async function setPostsPublished(ids: number[], published: boolean) {
  await requireAdmin();
  await PostService.setPublishedMany(Ids.parse(ids), published);
  revalidate();
}

export async function deletePosts(ids: number[]) {
  await requireAdmin();
  await PostService.deleteMany(Ids.parse(ids));
  revalidate();
}

export async function deletePost(postId: number) {
  await requireAdmin();
  await PostService.delete(postId);
  revalidate();
}

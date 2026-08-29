import { z } from "zod";

export const PostSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const PostBaseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  thumbnail: z.string().nullish(),
  published: z.boolean().default(false),
  authorId: z.number().int().min(1),
});

export const CreatePostSchema = PostBaseSchema;
export const UpdatePostSchema = PostBaseSchema.partial();

export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;

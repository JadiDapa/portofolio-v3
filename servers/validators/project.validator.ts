import { z } from "zod";

export const ProjectSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const ProjectBaseSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  client: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().optional(),
  coverImage: z.string().nullish(),
  year: z.number().int().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const CreateProjectSchema = ProjectBaseSchema;
export const UpdateProjectSchema = ProjectBaseSchema.partial();

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;

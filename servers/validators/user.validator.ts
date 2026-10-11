import { Prisma, Role } from "@/generated/prisma";
import { z } from "zod";

export type UserType = Prisma.UserGetPayload<object>;

const UserBaseSchema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.nativeEnum(Role),
});

export const CreateUserSchema = UserBaseSchema;
export const UpdateUserSchema = UserBaseSchema.partial();

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

"use server";

import { revalidatePath } from "next/cache";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "@/servers/validators/user.validator";
import { UserService } from "@/servers/services/user.service";
import { requireAdmin } from "@/lib/auth";
import z from "zod";

function revalidate() {
  revalidatePath("/dashboard/users");
}

/** Public: called by the sign-up form once Clerk has created the account. Always a plain USER. */
export async function registerUser(
  input: Pick<z.input<typeof CreateUserSchema>, "name" | "username">,
) {
  const data = CreateUserSchema.parse({ ...input, role: "USER" });
  await UserService.create(data);
}

export async function createUser(input: z.input<typeof CreateUserSchema>) {
  await requireAdmin();
  const data = CreateUserSchema.parse(input);
  await UserService.create(data);
  revalidate();
}

export async function updateUser(
  userId: number,
  input: z.input<typeof UpdateUserSchema>,
) {
  await requireAdmin();
  const data = UpdateUserSchema.parse(input);
  await UserService.update(userId, data);
  revalidate();
}

export async function deleteUser(userId: number) {
  await requireAdmin();
  await UserService.delete(userId);
  revalidate();
}

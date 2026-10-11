import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserService } from "@/servers/services/user.service";

/** The signed-in user's internal record; redirects to /sign-in when signed out. */
export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser?.username) {
    redirect("/sign-in");
  }

  const user = await UserService.getByUsername(clerkUser.username);

  if (!user) {
    throw new Error("User not found in database");
  }

  return user;
}

/** Guard for server actions: they are public endpoints, so every mutation must call this first. */
export async function requireAdmin() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return user;
}

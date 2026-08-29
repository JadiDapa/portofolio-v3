import { getCurrentUser } from "@/app/action/user.action";
import { UserService } from "@/servers/services/user.service";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateUserDialog from "@/components/dashboard/users/CreateUserDialog";
import UserCard from "@/components/dashboard/users/UserCard";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const users = await UserService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Users" subtitle="Manage user accounts." />
        <CreateUserDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No users yet.
        </p>
      )}
    </main>
  );
}

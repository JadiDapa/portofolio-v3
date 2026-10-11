import { getCurrentUser } from "@/lib/auth";
import { UserService } from "@/servers/services/user.service";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateUserSheet from "@/components/dashboard/users/CreateUserSheet";
import UserCard from "@/components/dashboard/users/UserCard";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await UserService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(09) Access"
        title="Users"
        subtitle="Accounts that can sign in."
        actions={<CreateUserSheet />}
      />

      {items.length === 0 ? (
        <DbEmpty title="No *users* yet" text="Create the first account." />
      ) : (
        <div className="db-grid">
          {items.map((u) => (
            <UserCard key={u.id} user={u} />
          ))}
        </div>
      )}
    </main>
  );
}

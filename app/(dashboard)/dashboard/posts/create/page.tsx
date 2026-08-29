import { getCurrentUser } from "@/app/action/user.action";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import CreatePostForm from "@/components/dashboard/posts/CreatePostForm";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="New Entry" subtitle="Write a new journal entry." />
      </div>

      <CreatePostForm authorId={user.id} />
    </main>
  );
}

import { getCurrentUser } from "@/lib/auth";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import PostForm from "@/components/dashboard/posts/PostForm";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader eyebrow="Journal" title="New entry" subtitle="Write on the left, watch the page on the right." />
      </div>

      <PostForm authorId={user.id} authorName={user.name ?? user.username} />
    </main>
  );
}

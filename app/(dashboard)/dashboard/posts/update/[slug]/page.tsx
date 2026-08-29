import { getCurrentUser } from "@/app/action/user.action";
import { PostService } from "@/servers/services/post.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import UpdatePostForm from "@/components/dashboard/posts/UpdatePostForm";
import { notFound, redirect } from "next/navigation";

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const post = await PostService.getBySlug(slug);

  if (!post) notFound();

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="Update Entry" subtitle="Edit your journal entry." />
      </div>

      <UpdatePostForm post={post} />
    </main>
  );
}

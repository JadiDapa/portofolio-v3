import { getCurrentUser } from "@/lib/auth";
import { PostService } from "@/servers/services/post.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import PostForm from "@/components/dashboard/posts/PostForm";
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
        <PageHeader eyebrow="Journal" title="Edit entry" subtitle="Changes show in the preview as you type." />
      </div>

      <PostForm post={post} authorName={post.author.name ?? post.author.username} />
    </main>
  );
}

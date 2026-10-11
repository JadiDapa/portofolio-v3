import { getCurrentUser } from "@/lib/auth";
import PageHeader from "@/components/dashboard/PageHeader";
import PostTable from "@/components/dashboard/posts/PostTable";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import GridButton from "@/components/root/work/GridButton";
import { PostService } from "@/servers/services/post.service";
import { redirect } from "next/navigation";

export default async function PostsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await PostService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(07) Writing"
        title="Journal"
        subtitle="Essays, notes and build logs."
        actions={<GridButton href="/dashboard/posts/create">New entry</GridButton>}
      />

      {items.length === 0 ? (
        <DbEmpty
          title="The page is *blank*"
          text="No journal entries yet. Write the first one."
          href="/dashboard/posts/create"
          cta="New entry"
        />
      ) : (
        <PostTable posts={items} />
      )}
    </main>
  );
}

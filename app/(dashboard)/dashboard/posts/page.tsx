import { getCurrentUser } from "@/app/action/user.action";
import PageHeader from "@/components/dashboard/PageHeader";
import PostTable from "@/components/dashboard/posts/PostTable";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PostsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const posts = await prisma.post.findMany({
    orderBy: { id: "desc" },
    include: { author: true },
  });

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Journal" subtitle="Manage your journal entries." />
        <Button asChild>
          <Link href="/dashboard/posts/create">
            <Plus className="size-4" />
            New Entry
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <PostTable posts={posts} />

        {posts.length === 0 && (
          <p className="text-muted-foreground py-16 text-center text-sm">
            No journal entries yet.{" "}
            <Link
              href="/dashboard/posts/create"
              className="text-foreground underline underline-offset-4"
            >
              Create your first entry →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

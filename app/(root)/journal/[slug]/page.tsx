import { PostService } from "@/servers/services/post.service";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await PostService.getBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <div className="px-gutter py-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/journal"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← All journal entries
        </Link>

        <article className="mt-8">
          <header className="mb-8 space-y-3 border-b pb-8">
            <h1 className="text-section font-semibold tracking-tight">{post.title}</h1>
            <p className="text-muted-foreground text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}By {post.author.name ?? post.author.username}
            </p>
          </header>

          {post.content ? (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-muted-foreground">
              This entry has no content yet.
            </p>
          )}
        </article>
      </div>
    </div>
  );
}

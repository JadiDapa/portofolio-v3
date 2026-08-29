import { PostService } from "@/servers/services/post.service";
import Link from "next/link";

export default async function PostListPage() {
  const { items: posts } = await PostService.list({
    published: true,
    pageSize: 100,
  });

  return (
    <div className="px-gutter py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-muted-foreground text-sm font-medium">
          Experts · Excerpts
        </p>
        <h1 className="text-section mt-2 font-semibold tracking-tight">
          The Journal
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          A collection of clippings from my engineering journey.
        </p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground mt-10">No entries published yet.</p>
        ) : (
          <div className="mt-10 divide-y">
            {posts.map((post) => (
              <article key={post.id} className="py-8">
                <p className="text-muted-foreground text-xs">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {" · "}By {post.author.name ?? post.author.username}
                </p>
                <Link href={`/journal/${post.slug}`} className="group mt-2 block">
                  <h2 className="text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
                    {post.title}
                  </h2>
                </Link>
                {post.content && (
                  <p className="text-muted-foreground mt-2 line-clamp-3">
                    {post.content}
                  </p>
                )}
                <Link
                  href={`/journal/${post.slug}`}
                  className="hover:text-muted-foreground mt-4 inline-block text-sm font-medium underline underline-offset-4 transition-colors"
                >
                  Read more
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

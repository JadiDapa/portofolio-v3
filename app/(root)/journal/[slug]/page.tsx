import { PostService } from "@/servers/services/post.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stripHtml } from "@/lib/format";
import PostArticle from "@/components/root/journal/PostArticle";
import ReadingProgress from "@/components/root/journal/ReadingProgress";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await PostService.getBySlug(slug);
  if (!post || !post.published) return {};

  const description = post.content ? stripHtml(post.content).slice(0, 160) : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name ?? post.author.username],
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await PostService.getBySlug(slug);

  if (!post || !post.published) notFound();

  const { newer, older } = await PostService.getNeighbours(post.id);

  return (
    <>
      <ReadingProgress />
      <PostArticle
        title={post.title}
        content={post.content}
        thumbnail={post.thumbnail}
        authorName={post.author.name ?? post.author.username}
        date={post.createdAt}
        newer={newer}
        older={older}
      />
    </>
  );
}

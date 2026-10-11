"use client";

import { useDeferredValue } from "react";
import PostArticle from "@/components/root/journal/PostArticle";
import LivePreview from "@/components/dashboard/ui/LivePreview";

/** The real /journal/[slug] page body, fed from the form while you type. */
export default function PostLivePreview({
  title,
  content,
  thumbnail,
  author,
}: {
  title?: string;
  content?: string | null;
  thumbnail?: string | null;
  author: string;
}) {
  const t = useDeferredValue(title);
  const c = useDeferredValue(content);

  return (
    <LivePreview label={`/journal/${(t || "untitled").toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="pt-(--space-l-xl)">
        <PostArticle
          title={t || ""}
          content={c || null}
          thumbnail={thumbnail || null}
          authorName={author}
          date={new Date()}
        />
      </div>
    </LivePreview>
  );
}

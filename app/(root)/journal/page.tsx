import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { PostService } from "@/servers/services/post.service";
import WorkTitle from "@/components/root/work/WorkTitle";
import JournalFeatured from "@/components/root/journal/JournalFeatured";
import JournalList from "@/components/root/journal/JournalList";

export const metadata: Metadata = {
  alternates: { canonical: "/journal" },
  title: "Journal",
  description: "A collection of clippings from my engineering journey.",
};

export default async function PostListPage() {
  const { items: posts } = await PostService.list({
    published: true,
    pageSize: 100,
  });
  const [latest, ...rest] = posts;

  return (
    <article className="px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-xl-2xl)">
        <WorkTitle
          labelLeft="Excerpts"
          labelRight="Clippings"
          heading="Journal"
          compactLabel
          opening="Notes, build logs and clippings from my engineering journey."
          art={<PenLine className="size-full" strokeWidth={1} aria-hidden />}
        />

        {latest ? (
          <>
            <JournalFeatured post={latest} />
            {rest.length > 0 && <JournalList posts={rest} />}
          </>
        ) : (
          <p className="jn-none wk-b wk-glass">
            Nothing here yet. The first entry is on its way.
          </p>
        )}
      </div>
    </article>
  );
}

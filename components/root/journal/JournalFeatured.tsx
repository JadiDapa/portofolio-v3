import Image from "next/image";
import Link from "next/link";
import GridButton from "@/components/root/work/GridButton";
import { formatDate, stripHtml } from "@/lib/format";
import { prepareArticle } from "@/lib/journal";
import { blurProps } from "@/lib/placeholder";

export type JournalListPost = {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  thumbnail: string | null;
  createdAt: Date;
  author: { name: string | null; username: string };
};

/** The newest entry, given the full width of the page: cover on one side, words on the other. */
export default function JournalFeatured({ post }: { post: JournalListPost }) {
  const href = `/journal/${post.slug}`;
  const { minutes } = prepareArticle(post.content);
  const excerpt = post.content ? stripHtml(post.content).slice(0, 260) : "";

  return (
    <section className="wk-grid">
      <Link
        href={href}
        aria-label={post.title}
        className="wk-route wk-b wk-inset col-span-2"
      >
        <div className="wk-inset-media">
          <div className="wk-inset-this">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt=""
                fill
                priority
                {...blurProps(post.thumbnail)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="jn-cover_fallback" aria-hidden>
                {post.title.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="wk-b wk-glass jn-feature col-span-2">
        <div className="space-y-(--space-xs-s)">
          <span className="wk-label text-[#b3b3b3]">(01) Latest entry</span>
          <h2 className="jn-feature_title">
            <Link href={href}>{post.title}</Link>
          </h2>
          <p className="wk-label">
            {formatDate(post.createdAt)}
            <span className="text-[#b3b3b3]"> / {minutes} min read</span>
          </p>
          {excerpt && <p className="wk-type-text jn-feature_ex">{excerpt}</p>}
        </div>

        <div className="jn-feature_cta">
          <GridButton href={href}>
            <span>Read entry</span>
            <svg viewBox="0 0 24 24" className="size-[1.4em] -rotate-45" aria-hidden>
              <path
                d="M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </GridButton>
        </div>
      </div>
    </section>
  );
}

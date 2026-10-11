import Image from "next/image";
import Link from "next/link";
import GridButton from "@/components/root/work/GridButton";
import ProjectTitle from "@/components/root/work/project/ProjectTitle";
import Body from "@/components/root/work/project/Body";
import CopyLink from "./CopyLink";
import { formatDate, pad2 } from "@/lib/format";
import { prepareArticle } from "@/lib/journal";
import { blurProps } from "@/lib/placeholder";

type Neighbour = { title: string; slug: string; thumbnail: string | null } | null;

type Props = {
  title: string;
  content: string | null;
  thumbnail: string | null;
  authorName: string;
  date: Date | string;
  /** Previous / next entries. Omitted in the dashboard preview. */
  newer?: Neighbour;
  older?: Neighbour;
};

/**
 * The /journal/[slug] page body, shared with the dashboard's live preview so the two
 * can never drift apart.
 */
export default function PostArticle({
  title,
  content,
  thumbnail,
  authorName,
  date,
  newer,
  older,
}: Props) {
  const { html, headings, words, minutes } = prepareArticle(content);

  const meta = [
    { label: "Published", value: formatDate(date) },
    { label: "Written by", value: authorName },
    { label: "Reading time", value: `${minutes} min` },
    { label: "Length", value: `${words.toLocaleString("en-US")} words` },
  ];

  return (
    <article id="top" className="jn-page px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-l-xl)">
        <header>
          <ul className="flex">
            <li className="relative z-3">
              <GridButton href="/journal">
                <span>All entries</span>
              </GridButton>
            </li>
          </ul>

          <div className="wk-glass">
            <ProjectTitle title={title || "Untitled entry"} />
          </div>

          <div className="wk-grid">
            {meta.map((m, i) => (
              <div key={m.label} className="wk-b wk-glass p-(--space-s-m)">
                <span className="wk-label text-[#b3b3b3]">
                  ({pad2(i + 1)}) {m.label}
                </span>
                <p className="wk-feature-title mt-(--space-3xs-2xs)">{m.value}</p>
              </div>
            ))}
          </div>
        </header>

        {thumbnail && (
          <div className="wk-b wk-fade-in relative aspect-video overflow-hidden bg-foreground">
            <Image
              src={thumbnail}
              alt=""
              fill
              priority
              sizes="(min-width: 1500px) 1500px, 100vw"
              className="object-cover"
              {...blurProps(thumbnail)}
            />
          </div>
        )}

        <div className="wk-grid">
          <aside className="jn-aside wk-b col-span-2 lg:col-span-1">
            <div className="jn-aside_sticky">
              {headings.length > 1 && (
                <nav aria-label="Contents">
                  <span className="wk-label text-[#b3b3b3]">In this entry</span>
                  <ol className="jn-toc">
                    {headings.map((h, i) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`}>
                          <span>({pad2(i + 1)})</span>
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="jn-aside_tools">
                <CopyLink />
                <a href="#top" className="jn-aside_btn">
                  <span>Back to top</span>
                  <svg viewBox="0 0 24 24" className="size-[1.2em]" aria-hidden>
                    <path
                      d="M12 19V5m0 0l-6 6m6-6l6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </aside>

          <div className="wk-b col-span-2 p-(--space-s-m) lg:col-span-3 lg:p-(--space-l-xl)">
            {html ? (
              <div className="jn-prose">
                <Body content={html} />
              </div>
            ) : (
              <p className="jn-empty">This entry has no words yet.</p>
            )}
            <p className="jn-end" aria-hidden>
              ✱ End
            </p>
          </div>
        </div>

        {(newer || older) && (
          <nav aria-label="More entries" className="wk-grid">
            {[
              { post: older, label: "Previous entry", dir: "prev" },
              { post: newer, label: "Next entry", dir: "next" },
            ].map(({ post, label, dir }) =>
              post ? (
                <Link
                  key={dir}
                  href={`/journal/${post.slug}`}
                  className="jn-next wk-b col-span-2"
                  data-dir={dir}
                >
                  <span className="wk-label">
                    {dir === "prev" ? "← " : ""}
                    {label}
                    {dir === "next" ? " →" : ""}
                  </span>
                  <span className="jn-next_title">{post.title}</span>
                </Link>
              ) : null,
            )}
          </nav>
        )}
      </div>
    </article>
  );
}

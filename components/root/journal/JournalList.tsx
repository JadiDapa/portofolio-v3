import Image from "next/image";
import Link from "next/link";
import { pad2, stripHtml } from "@/lib/format";
import { prepareArticle } from "@/lib/journal";
import { blurProps } from "@/lib/placeholder";
import type { JournalListPost } from "./JournalFeatured";

const shortDate = (d: Date) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** The rest of the entries, grouped by year. `startAt` continues the numbering after the featured one. */
export default function JournalList({
  posts,
  startAt = 2,
}: {
  posts: JournalListPost[];
  startAt?: number;
}) {
  const years: { year: number; items: JournalListPost[] }[] = [];

  for (const post of posts) {
    const year = new Date(post.createdAt).getUTCFullYear();
    const group = years.find((g) => g.year === year);
    if (group) group.items.push(post);
    else years.push({ year, items: [post] });
  }

  let n = startAt;

  return (
    <div className="jn-list">
      {years.map(({ year, items }) => (
        <section key={year} aria-label={String(year)}>
          <header className="jn-year">
            <span className="jn-year_num">{year}</span>
            <span className="wk-label text-[#b3b3b3]">
              {pad2(items.length)} {items.length === 1 ? "entry" : "entries"}
            </span>
          </header>

          <ul>
            {items.map((post) => {
              const index = n++;
              const { minutes } = prepareArticle(post.content);
              const excerpt = post.content ? stripHtml(post.content).slice(0, 170) : "";

              return (
                <li key={post.id}>
                  <Link href={`/journal/${post.slug}`} className="jn-row">
                    <span className="jn-row_num wk-label">({pad2(index)})</span>

                    <span className="jn-row_main">
                      <span className="jn-row_title">{post.title}</span>
                      {excerpt && <span className="jn-row_ex">{excerpt}</span>}
                    </span>

                    <span className="jn-row_meta wk-label">
                      <span>{shortDate(post.createdAt)}</span>
                      <span className="text-[#b3b3b3]">{minutes} min</span>
                    </span>

                    <span className="jn-row_thumb" aria-hidden>
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail}
                          alt=""
                          fill
                          sizes="180px"
                          className="object-cover"
                          {...blurProps(post.thumbnail)}
                        />
                      ) : (
                        <span>{post.title.charAt(0)}</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

import Image from "next/image";
import ShowcaseInView from "./ShowcaseInView";

type ShowcaseItem = { id: number; title: string; coverImage: string };

/** One endless row; the list is doubled so the -50% loop lands seamlessly. */
function Row({ items, reverse }: { items: ShowcaseItem[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="-mx-(--space-m-l) overflow-hidden">
      <div
        className={reverse ? "ct-carousel ct-carousel--reverse" : "ct-carousel"}
        // one tile (11em + 0.6em gap = ~369px at 1440) every 6.12s = 60.3px/s, as measured on the reference
        style={{ "--ct-duration": `${items.length * 6.12}s` } as React.CSSProperties}
      >
        {loop.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="ct-media"
            style={{ "--i": i % items.length } as React.CSSProperties}
            data-wipe={reverse ? "left" : "right"}
            aria-hidden={i >= items.length}
          >
            <Image
              src={item.coverImage}
              alt={i < items.length ? item.title : ""}
              fill
              sizes="350px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bordered strip of project covers scrolling in opposite directions. */
export default function ContactShowcase({ items }: { items: ShowcaseItem[] }) {
  if (!items.length) return null;

  // Pad short lists so each row is always wider than the viewport
  let filled = items;
  while (filled.length < 8) filled = [...filled, ...items];
  const half = Math.ceil(filled.length / 2);
  const top = filled.slice(0, half);
  const bottom = [...filled.slice(half), ...filled.slice(0, filled.length % 2)];

  return (
    <section className="wk-b ct-showcase-pad" data-cmp="showcase">
      <ShowcaseInView>
      <div className="ct-showcase">
        <Row items={top} reverse />
        <Row items={bottom} />
      </div>
      </ShowcaseInView>
    </section>
  );
}

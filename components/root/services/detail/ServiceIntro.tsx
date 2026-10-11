"use client";

import { Info } from "lucide-react";
import RevealHeading from "@/components/root/work/RevealHeading";

/** Splits stored HTML into its first paragraph (the opening) and the rest. */
function splitDescription(html: string | null) {
  if (!html) return { opening: "", rest: "" };
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
  if (paragraphs.length === 0) return { opening: html, rest: "" };
  return { opening: paragraphs[0], rest: paragraphs.slice(1).join("</p><p>") };
}

export default function ServiceIntro({
  headline,
  lead,
  description,
}: {
  headline: string;
  lead: string;
  description: string | null;
}) {
  const { opening, rest } = splitDescription(description);

  return (
    <section>
      <div className="relative">
        <div className="sd-intro-tile">
          <div data-cmp="introTile" className="sv-tile wk-b flex">
            <Info strokeWidth={1} aria-hidden />
          </div>
        </div>

        <div
          data-cmp="introHeading"
          className="wk-b wk-glass px-(--space-xs-s) py-(--space-s-m) text-center sm:py-(--space-l-xl)"
        >
          <h2 className="wk-heading text-balance">
            <RevealHeading text={headline} inView />
          </h2>
        </div>
      </div>

      <div className="wk-grid">
        <div className="col-span-2">
          <div
            data-cmp="introLead"
            className="wk-b wk-glass p-(--space-s-m)"
          >
            <p className="wk-reduced sd-title text-pretty">{lead}</p>
          </div>
        </div>

        <div className="col-span-2">
          <div
            data-cmp="introText"
            className="wk-b wk-glass space-y-(--space-s-m) p-(--space-s-m)"
          >
            {opening && (
              <p
                className="wk-reduced wk-opening"
                dangerouslySetInnerHTML={{ __html: opening }}
              />
            )}
            {rest && (
              <p
                className="wk-reduced wk-type-text"
                dangerouslySetInnerHTML={{ __html: rest }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

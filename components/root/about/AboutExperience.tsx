"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import type { Experience } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import AboutTitle from "./AboutTitle";
import Reveal from "./Reveal";

const year = (d: Date) => new Date(d).getUTCFullYear();
const month = (d: Date) =>
  new Date(d)
    .toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })
    .toUpperCase();

/** Records which edge the cursor came in from so the fill grows from there. */
function setOrigin(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty(
    "--origin",
    e.clientY - r.top < r.height / 2 ? "top" : "bottom",
  );
}

function Row({ item, defaultOpen }: { item: Experience; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const panel = useId();
  const current = !item.endDate;
  const hasMore =
    !!item.description || item.highlights.length > 0 || item.tools.length > 0;

  return (
    <Reveal as="li" x className="ab-xp_item" data-open={open || undefined}>
      <button
        type="button"
        className="ab-xp_btn"
        aria-expanded={hasMore ? open : undefined}
        aria-controls={hasMore ? panel : undefined}
        disabled={!hasMore}
        onClick={() => setOpen((o) => !o)}
        onPointerEnter={setOrigin}
        onPointerLeave={setOrigin}
      >
        <span className="ab-xp_cell ab-px wk-b">
          <span>
            <span className="ab-xp_years">
              {year(item.startDate)} — {current ? "Now" : year(item.endDate!)}
            </span>
            <span className="wk-label ab-xp_range">
              {month(item.startDate)} → {current ? "Present" : month(item.endDate!)}
            </span>
          </span>
        </span>
        <span className="ab-xp_cell ab-px wk-b ab-xp_main">
          <span className="min-w-0">
            <span className="ab-strong block">{item.role}</span>
            <span className="ab-subtext block">{item.organization}</span>
          </span>
          {current && (
            <span className="ab-xp_live wk-label">
              <i aria-hidden /> Now
            </span>
          )}
        </span>
        <span className="ab-tile wk-b" aria-hidden>
          {hasMore && <Plus strokeWidth={1} className="ab-xp_plus" />}
        </span>
      </button>

      {hasMore && (
        <div id={panel} role="region" className="ab-xp_body" inert={!open}>
          <div className="ab-xp_inner">
            <div className="ab-xp_content">
              {item.description && (
                <p className="ab-subtext max-w-[48em]">{item.description}</p>
              )}
              {item.highlights.length > 0 && (
                <ul className="ab-xp_hl">
                  {item.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {item.tools.length > 0 && (
                <ul className="ab-xp_tools" aria-label="Tools used">
                  {item.tools.map((t) => (
                    <li key={t} className="sd-tool">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </Reveal>
  );
}

/** Work and organization history, one tab each. Click a row to open its highlights. */
export default function AboutExperience({
  work,
  organization,
}: {
  work: Experience[];
  organization: Experience[];
}) {
  const tabs = [
    { key: "work", label: "Work", items: work },
    { key: "org", label: "Organizations", items: organization },
  ].filter((t) => t.items.length > 0);
  const [active, setActive] = useState(tabs[0]?.key);

  if (tabs.length === 0) return null;
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <section data-cmp="experience">
      <AboutTitle
        cmp="expTitle"
        className="wk-pad"
        boxed={false}
        compact
        left="Been there"
        right="Built that"
        heading="Experience"
        opening="Where I have worked and the communities I have helped run, with what I used along the way."
        inView
      />

      {tabs.length > 1 && (
        <div className="ab-xp_tabs wk-b ab-glass" role="tablist" aria-label="Experience type">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === current.key}
              className={cn("ab-xp_tab wk-label", t.key === current.key && "is-active")}
              onClick={() => setActive(t.key)}
            >
              {t.label} <span aria-hidden>({String(t.items.length).padStart(2, "0")})</span>
            </button>
          ))}
        </div>
      )}

      <ul key={current.key} className="ab-xp ab-glass">
        {current.items.map((item, i) => (
          <Row key={item.id} item={item} defaultOpen={i === 0} />
        ))}
      </ul>
    </section>
  );
}

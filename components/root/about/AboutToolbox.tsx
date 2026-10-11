"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pad2 } from "@/lib/format";
import { cn } from "@/lib/utils";
import { symbolOf } from "@/lib/format";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import type { Skill } from "@/servers/validators/service.validator";
import AboutTitle from "./AboutTitle";

export type ToolboxService = { slug: string; title: string; skills: Skill[] };

type Tool = {
  key: string;
  name: string;
  /** Periodic-table style symbol: "Next.js" → "Ne", "Tailwind CSS" → "TC". */
  symbol: string;
  /** service index → names of the skills that use it there */
  uses: Map<number, string[]>;
};

/** Every distinct tool across the services, with where each one is used. */
function indexTools(services: ToolboxService[]): Tool[] {
  const map = new Map<string, Tool>();
  services.forEach((service, si) => {
    for (const skill of service.skills) {
      for (const name of skill.tools) {
        const key = name.toLowerCase();
        let tool = map.get(key);
        if (!tool) {
          tool = { key, name, symbol: symbolOf(name), uses: new Map() };
          map.set(key, tool);
        }
        tool.uses.set(si, [...(tool.uses.get(si) ?? []), skill.name]);
      }
    }
  });
  // Tools that bridge the most disciplines first, then alphabetical
  return [...map.values()].sort(
    (a, b) => b.uses.size - a.uses.size || a.name.localeCompare(b.name),
  );
}

/**
 * Periodic table of tools. Pick a discipline to dim everything outside it;
 * hover (or tap) a tile to see which disciplines and skills use it.
 */
export default function AboutToolbox({ services }: { services: ToolboxService[] }) {
  const shown = useMemo(() => services.filter((s) => s.skills.length > 0), [services]);
  const tools = useMemo(() => indexTools(shown), [shown]);
  const [filter, setFilter] = useState<number | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ rootMargin: "0px 0px -8% 0px" });

  if (shown.length === 0) return null;

  const activeKey = hover ?? pinned;
  const active = tools.find((t) => t.key === activeKey) ?? null;
  const matching = tools.filter((t) => filter === null || t.uses.has(filter)).length;
  const focus = filter !== null ? shown[filter] : null;

  return (
    <section data-cmp="toolbox">
      <AboutTitle
        cmp="toolboxTitle"
        className="wk-pad"
        boxed={false}
        compact
        left="Tools"
        right="Trade"
        heading="Toolbox"
        opening="Four disciplines, each broken into skills, each skill into the tools I use for it. Hover a tool to see where else it turns up."
        inView
      />

      <div ref={ref} data-visible={visible || undefined} className="ab-tbx">
        {/* Index: disciplines act as filters, the lower card explains the hovered tool */}
        <aside className="ab-tbx_side">
          <div className="ab-tbx_filters wk-b ab-glass" role="group" aria-label="Filter by discipline">
            <button
              type="button"
              className="ab-tbx_filter"
              aria-pressed={filter === null}
              onClick={() => setFilter(null)}
            >
              <span className="wk-label">(00)</span>
              <span className="ab-tbx_fname">Everything</span>
              <span className="ab-tbx_count">{pad2(tools.length)}</span>
            </button>
            {shown.map((service, i) => {
              const count = tools.filter((t) => t.uses.has(i)).length;
              return (
                <button
                  key={service.slug}
                  type="button"
                  className="ab-tbx_filter"
                  aria-pressed={filter === i}
                  data-used={active?.uses.has(i) || undefined}
                  onClick={() => setFilter(filter === i ? null : i)}
                >
                  <span className="wk-label">({pad2(i + 1)})</span>
                  <span className="ab-tbx_fname">{service.title}</span>
                  <span className="ab-tbx_count">{pad2(count)}</span>
                </button>
              );
            })}
          </div>

          <div className="ab-tbx_card wk-b ab-glass" aria-live="polite">
            {active ? (
              <>
                <p className="wk-label text-[#b3b3b3]">
                  Used in {pad2(active.uses.size)}{" "}
                  {active.uses.size === 1 ? "discipline" : "disciplines"}
                </p>
                <p className="ab-tbx_big">{active.name}</p>
                <ul className="ab-tbx_uses">
                  {[...active.uses].map(([si, skills]) => (
                    <li key={si}>
                      <span className="wk-label">({pad2(si + 1)})</span>
                      <span>
                        <b>{shown[si].title}</b>
                        <small>{skills.join(" · ")}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : focus ? (
              <>
                <p className="wk-label text-[#b3b3b3]">
                  {pad2(matching)} tools · {pad2(focus.skills.length)} skills
                </p>
                <p className="ab-tbx_big">{focus.title}</p>
                <ul className="ab-tbx_skills">
                  {focus.skills.map((k) => (
                    <li key={k.id ?? k.name}>{k.name}</li>
                  ))}
                </ul>
                <Link href={`/services/${focus.slug}`} className="ab-tbx_go wk-label">
                  See the service <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden />
                </Link>
              </>
            ) : (
              <>
                <p className="wk-label text-[#b3b3b3]">Index</p>
                <p className="ab-tbx_num">
                  {pad2(tools.length)}
                  <span> tools</span>
                </p>
                <p className="ab-subtext">
                  across {pad2(shown.length)} disciplines. The ones that appear in several are
                  listed first.
                </p>
              </>
            )}
          </div>
        </aside>

        <div className="ab-tbx_main" onPointerLeave={() => setHover(null)}>
          {shown.map((service, si) => {
            if (filter !== null && filter !== si) return null;
            return (
              <section
                // Remounting on filter change replays the entrance
                key={`${service.slug}-${filter}`}
                className="ab-tbx_block"
                aria-label={service.title}
              >
                <header className="ab-tbx_bhead wk-b ab-glass">
                  <span className="ab-tbx_bnum">{pad2(si + 1)}</span>
                  <Link href={`/services/${service.slug}`} className="ab-tbx_btitle">
                    {service.title}
                    <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden />
                  </Link>
                  <span className="wk-label text-[#b3b3b3]">
                    {pad2(service.skills.length)} skills
                  </span>
                </header>

                {service.skills.map((skill, ki) => (
                  <div key={skill.id ?? skill.name} className="ab-tbx_group">
                    <div className="ab-tbx_label wk-b ab-glass">
                      <span className="wk-label text-[#b3b3b3]">
                        {pad2(si + 1)}.{ki + 1}
                      </span>
                      <p className="ab-tbx_skill">{skill.name}</p>
                      {skill.summary && <p className="ab-tbx_sum">{skill.summary}</p>}
                    </div>
                    <ul className="ab-tbx_grid">
                      {skill.tools.map((name, ti) => {
                        const tool = tools.find((t) => t.key === name.toLowerCase());
                        if (!tool) return null;
                        const isActive = activeKey === tool.key;
                        return (
                          <li key={name} style={{ "--i": ti + ki * 2 } as React.CSSProperties}>
                            <button
                              type="button"
                              className={cn("ab-tbx_tile", isActive && "is-active")}
                              data-bridge={tool.uses.size > 1 || undefined}
                              aria-pressed={pinned === tool.key}
                              aria-label={`${name}, ${skill.name}`}
                              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(tool.key)}
                              onFocus={() => setHover(tool.key)}
                              onBlur={() => setHover(null)}
                              onClick={() => setPinned(pinned === tool.key ? null : tool.key)}
                            >
                              <span className="ab-tbx_pips" aria-hidden>
                                {shown.map((sv, k) => (
                                  <i key={sv.slug} data-on={tool.uses.has(k) || undefined} />
                                ))}
                              </span>
                              <span className="ab-tbx_sym" aria-hidden>
                                {tool.symbol}
                              </span>
                              <span className="ab-tbx_name">{name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

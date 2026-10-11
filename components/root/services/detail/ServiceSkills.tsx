"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { pad2, symbolOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import RevealHeading from "@/components/root/shared/RevealHeading";
import type { Skill } from "@/servers/validators/service.validator";

/**
 * Service → skills → tools. Each skill is a labelled row; its tools are
 * element-style tiles beside it. Hover a tool and its twins in other skills light up.
 */
export default function ServiceSkills({
  skills,
  title,
}: {
  skills: Skill[];
  title: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [ref, visible] = useInViewOnce<HTMLDivElement>({ rootMargin: "0px 0px -8% 0px" });

  if (skills.length === 0) return null;
  const activeKey = hover ?? pinned;

  return (
    <section className="py-(--space-l-xl)">
      <div className="relative">
        <div className="sd-intro-tile">
          <div className="sv-tile wk-b flex">
            <Wrench strokeWidth={1} aria-hidden />
          </div>
        </div>
        <div className="wk-b wk-glass space-y-(--space-3xs-2xs) px-(--space-xs-s) py-(--space-s-m) text-center sm:py-(--space-l-xl)">
          <h2 className="sd-subheading text-balance">
            <RevealHeading text="Skills & tools" inView />
          </h2>
          <p className="wk-type-text mx-auto text-balance">
            What a {title} project draws on
          </p>
        </div>
      </div>

      <div
        ref={ref}
        data-visible={visible || undefined}
        className="ab-tbx ab-tbx--solo"
        onPointerLeave={() => setHover(null)}
      >
        {skills.map((skill, ki) => (
          <div key={skill.id ?? ki} className="ab-tbx_group">
            <div className="ab-tbx_label wk-b wk-glass">
              <span className="wk-label text-[#b3b3b3]">({pad2(ki + 1)})</span>
              <p className="ab-tbx_skill">{skill.name}</p>
              {skill.summary && <p className="ab-tbx_sum">{skill.summary}</p>}
            </div>
            <ul className="ab-tbx_grid">
              {skill.tools.map((name, ti) => {
                const key = name.toLowerCase();
                return (
                  <li key={name} style={{ "--i": ti + ki * 2 } as React.CSSProperties}>
                    <button
                      type="button"
                      className={cn("ab-tbx_tile", activeKey === key && "is-active")}
                      aria-pressed={pinned === key}
                      aria-label={`${name}, ${skill.name}`}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(key)}
                      onFocus={() => setHover(key)}
                      onBlur={() => setHover(null)}
                      onClick={() => setPinned(pinned === key ? null : key)}
                    >
                      <span className="ab-tbx_sym" aria-hidden>
                        {symbolOf(name)}
                      </span>
                      <span className="ab-tbx_name">{name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

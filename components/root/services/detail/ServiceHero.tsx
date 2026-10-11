"use client";

import { useEffect, useRef } from "react";
import { useEntered } from "@/hooks/use-entered";
import BoxFrame from "@/components/root/shared/BoxFrame";
import { Sparkles } from "lucide-react";
import RevealHeading from "@/components/root/shared/RevealHeading";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";
import ServiceLink from "./ServiceLink";

const SET = 6;

/** One drifting row: two copies of the same six slides so the loop is seamless. */
function Row({ images, right }: { images: (string | null)[]; right?: boolean }) {
  const slides = Array.from({ length: SET * 2 }, (_, i) => images[i % SET]);
  return (
    <div className={right ? "sd-row sd-row--right" : "sd-row"} data-cmp="row">
      <div className="sd-track">
        {slides.map((src, i) => (
          <div
            key={i}
            className="sd-slide"
            style={{ "--sd-delay": `${(i % SET) * 0.05}s` } as React.CSSProperties}
          >
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" loading="eager" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServiceHero({
  slug,
  title,
  summary,
  images,
}: {
  slug: string;
  title: string;
  summary: string;
  images: string[];
}) {
  const visible = useEntered();
  const heading = useRef<HTMLHeadingElement>(null);
  const Icon = SERVICE_ICONS[slug] ?? DEFAULT_SERVICE_ICON;

  // A long single word (e.g. "Development") would clip on a phone: shrink the
  // whole heading just enough for the widest word to fit
  useEffect(() => {
    const el = heading.current;
    if (!el) return;
    const fit = () => {
      el.style.removeProperty("zoom");
      const widest = Math.max(
        0,
        ...Array.from(el.querySelectorAll<HTMLElement>(".wk-word"), (w) => w.scrollWidth),
      );
      if (widest > el.clientWidth) el.style.zoom = String(el.clientWidth / widest);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    return () => ro.disconnect();
  }, [title]);

  // Pad to a full set so the rows never show a gap, then offset the second row
  const pool = Array.from({ length: SET }, (_, i) => images.length ? images[i % images.length] : null);
  const second = [...pool.slice(3), ...pool.slice(0, 3)];

  return (
    <section>
      <div className="sd-hero" data-cmp="hero">
        <BoxFrame visible={visible} className="sd-hero-glass" />

        <div className="sd-hero-title" data-cmp="heroTitle">
          <header className="wk-pad relative space-y-(--space-3xs-2xs) text-center">
            <p className="wk-label sd-title-label">
              <Icon className="sd-title-icon" strokeWidth={1} aria-hidden />
            </p>
            <div className="space-y-(--space-s-m)">
              <h1 ref={heading} data-cmp="h1" className="wk-heading text-balance">
                <RevealHeading text={title} />
              </h1>
              <p className="wk-opening sd-opening mx-auto max-w-195 text-balance">
                {summary}
              </p>
            </div>
          </header>
        </div>

        <div className="sd-showcase" data-cmp="showcase">
          <Row images={pool} right />
          <Row images={second} />
        </div>
      </div>

      <div className="wk-grid">
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 lg:col-start-4">
          <ServiceLink href="/work" label="View my work" Icon={Sparkles} />
        </div>
      </div>
    </section>
  );
}

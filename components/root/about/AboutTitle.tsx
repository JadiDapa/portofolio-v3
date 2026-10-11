"use client";

import { useEffect, useState } from "react";
import RevealHeading from "@/components/root/work/RevealHeading";
import { cn } from "@/lib/utils";

/** Thin ampersand drawn between the two label words. */
export function AmpersandArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <path
        d="M34.5 41.5 15.8 21.2c-2.6-2.9-3.6-5-3.6-7.4 0-4.1 3.2-7.3 7.4-7.3 4 0 7 3 7 6.9 0 3.5-2.3 5.9-7.4 9.3-5.5 3.7-8.2 6.8-8.2 11 0 4.8 3.9 8.3 9.2 8.3 4.6 0 8.2-2.2 11.5-7.2L36 28.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Centered label · heading · opening block inside a box whose hairlines draw in. */
export default function AboutTitle({
  left,
  right,
  heading,
  opening,
  extrude,
  inView,
  as: H = "p",
  boxed = true,
  compact,
  className,
  cmp,
}: {
  left: string;
  right: string;
  heading: string;
  opening?: string;
  extrude?: number;
  inView?: boolean;
  as?: "h1" | "p";
  boxed?: boolean;
  /** Keeps the label and uses the smaller heading on mobile (Recognition). */
  compact?: boolean;
  className?: string;
  cmp: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={cn("relative", className)} data-cmp={cmp}>
      {boxed && (
        <div className="wk-box" data-visible={visible || undefined} aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      <header className="relative space-y-(--space-3xs-2xs) text-center">
        <p
          className={cn(
            "wk-label items-center justify-center gap-(--space-3xs-2xs)",
            compact ? "flex" : "hidden sm:flex",
          )}
        >
          <span className="basis-[40%] text-right">{left}</span>
          <span className="size-[5em] shrink-0">
            <AmpersandArt />
          </span>
          <span className="basis-[40%] text-left">{right}</span>
        </p>
        <div className="space-y-(--space-s-m)">
          <H className={cn("wk-heading text-balance", compact && "wk-heading--sm")}>
            <RevealHeading text={heading} extrude={extrude} inView={inView} />
          </H>
          {opening && (
            <p className="wk-opening mx-auto max-w-[48.75rem] text-balance">{opening}</p>
          )}
        </div>
      </header>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { LabelArt } from "./WorkArt";
import RevealHeading from "./RevealHeading";
import { cn } from "@/lib/utils";

const LABEL_LEFT = "Project";
const LABEL_RIGHT = "Showcase";
const HEADING = "My Work";
const OPENING =
  "Software, hardware and everything in between — a selection of client work and personal builds.";

export default function WorkTitle({
  labelLeft = LABEL_LEFT,
  labelRight = LABEL_RIGHT,
  heading = HEADING,
  opening = OPENING,
  art = <LabelArt />,
  compactLabel,
}: {
  labelLeft?: string;
  labelRight?: string;
  heading?: string;
  opening?: string;
  art?: React.ReactNode;
  /** Drop the label row on phones, leaving just the heading and opening. */
  compactLabel?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section>
      <div className="relative" data-cmp="title">
        <div className="wk-box" data-visible={visible || undefined} aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>

        <header className="wk-pad relative space-y-(--space-3xs-2xs) text-center">
          <p
            data-cmp="label"
            className={cn(
              "wk-label items-center justify-center gap-(--space-3xs-2xs)",
              compactLabel ? "hidden sm:flex" : "flex",
            )}
          >
            <span className="basis-[40%] text-right">{labelLeft}</span>
            <span className="size-[5em] shrink-0">
              {art}
            </span>
            <span className="basis-[40%] text-left">{labelRight}</span>
          </p>

          <div className="space-y-(--space-s-m)">
            <h1 data-cmp="h1" className="wk-heading text-balance">
              <RevealHeading text={heading} />
            </h1>
            <p data-cmp="opening" className="wk-opening mx-auto max-w-195 text-balance">
              {opening}
            </p>
          </div>
        </header>
      </div>
    </section>
  );
}

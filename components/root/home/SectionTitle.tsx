"use client";

import { useEffect, useRef, useState } from "react";
import RevealHeading from "@/components/root/work/RevealHeading";
import { cn } from "@/lib/utils";

/**
 * Centred section title: label row (text · art · text), heading with letters
 * that pop in once scrolled to, and an opening line. `boxed` draws the four
 * hairlines around it (and fades in the glass) when it comes into view.
 */
export default function SectionTitle({
  labelLeft,
  labelRight,
  art,
  heading,
  opening,
  boxed,
  className,
}: {
  labelLeft: string;
  labelRight: string;
  art: React.ReactNode;
  /** Words wrapped in *asterisks* are extruded. */
  heading: string;
  opening: React.ReactNode;
  boxed?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {boxed && (
        <div className="wk-box ct-glass" data-visible={visible || undefined} aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      <header
        className={cn(
          "relative space-y-(--space-3xs-2xs) text-center",
          boxed && "wk-pad",
        )}
      >
        <p className="wk-label flex items-center justify-center gap-(--space-3xs-2xs)">
          <span className="hidden basis-[40%] text-right sm:block">{labelLeft}</span>
          <span className="size-[5em] shrink-0">{art}</span>
          <span className="hidden basis-[40%] text-left sm:block">{labelRight}</span>
        </p>

        <div className="space-y-(--space-s-m)">
          <h2 className="wk-heading text-balance">
            <RevealHeading text={heading} inView />
          </h2>
          <p className="wk-opening mx-auto max-w-none text-balance">{opening}</p>
        </div>
      </header>
    </div>
  );
}

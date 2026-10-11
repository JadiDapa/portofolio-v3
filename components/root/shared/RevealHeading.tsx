"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import ExtrudeChar from "@/components/root/shared/ExtrudeChar";

/**
 * Letters rise out of a clipped box with a springy overshoot.
 * `lowercase` uses the tighter word/char boxes meant for mixed-case titles;
 * `inView` waits until the heading scrolls into view instead of animating on mount.
 * `extrude` renders the last N words as extruded letters that pop out in turn.
 * Words never break, so when the widest one is wider than the box (a long
 * word on a phone) the whole heading is zoomed down just enough to fit.
 */
export default function RevealHeading({
  text,
  lowercase,
  inView,
  extrude = 0,
  breakAfter,
}: {
  text: string;
  lowercase?: boolean;
  inView?: boolean;
  extrude?: number;
  /** Index of a word to force a line break after, from the `sm` breakpoint up. */
  breakAfter?: number;
}) {
  let index = 0;
  // A word wrapped in *asterisks* is extruded wherever it sits in the text
  const marked = text.split(" ").map((raw) => ({
    word: raw.replace(/^\*(.+)\*$/, "$1"),
    extruded: /^\*.+\*$/.test(raw),
  }));
  const words = marked.map((m) => m.word);
  const target = { y: "0%" };
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
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
  }, [text]);

  return (
    <span ref={root} className={cn("mr-[-0.12em] block", lowercase && "wk-lc")}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`}>
          <span className="wk-word relative z-1 inline-block whitespace-nowrap">
            {word.split("").map((char, c) => {
              const i = index++;
              const delay = 0.12 + i * 0.04 + w * 0.12;
              if (w >= words.length - extrude || marked[w].extruded) {
                return (
                  <ExtrudeChar
                    key={`${char}-${c}`}
                    char={char}
                    delay={delay}
                    zIndex={word.length - c}
                  />
                );
              }
              return (
                <span key={`${char}-${c}`} className="wk-char">
                  <motion.span
                    className="inline-block"
                    initial={{ y: lowercase ? "115%" : "100%" }}
                    animate={inView ? undefined : target}
                    whileInView={inView ? target : undefined}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      duration: 0.9,
                      bounce: 0.32,
                      delay,
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
          {w === breakAfter && <br className="hidden sm:inline" />}
          {w < words.length - 1 && <span>{lowercase ? " " : "  "}</span>}
        </span>
      ))}
    </span>
  );
}

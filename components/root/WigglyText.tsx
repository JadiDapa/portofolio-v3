"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface WigglyTextProps {
  text: string;
  className?: string;
  /** Set to fade/slide letters in on mount; omit to render without animation. */
  delay?: number;
  duration?: number;
  /** Delay added per letter, creating the staggered entrance. */
  stagger?: number;
  y?: number;
  /** Thickness of the outline stroke on the foreground letters. */
  strokeWidth?: number;
}

/**
 * Same idea as HoverShadowBox — a hard shadow layer fixed in place while the
 * content pops up-and-right on hover — but for text: the foreground letters
 * are outlined in the foreground color with a background-colored fill, so
 * the solid shadow layer behind shows through the hollow of each letter.
 */
export function WigglyText({
  text,
  className,
  delay,
  duration = 0.5,
  stagger = 0.05,
  y = 25,
  strokeWidth = 2,
}: WigglyTextProps) {
  const letters = text.split("");

  const outlineStyle: React.CSSProperties = {
    WebkitTextStroke: `${strokeWidth}px var(--foreground)`,
    paintOrder: "stroke fill",
  };

  const renderLetter = (char: string, i: number) => (
    <span
      key={i}
      className="text-background inline-block transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
      style={outlineStyle}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );

  const content = (
    <>
      {/* shadow layer — solid foreground fill, fixed in the original position */}
      <span
        aria-hidden
        className="text-foreground absolute inset-0 flex translate-x-1.5 translate-y-1.5"
      >
        {delay === undefined
          ? letters.map((char, i) => (
              <span key={i}>{char === " " ? "\u00A0" : char}</span>
            ))
          : letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: delay + i * stagger,
                  duration,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
      </span>

      {/* foreground layer — outlined letters, background-colored fill */}
      <span className="relative flex">
        {delay === undefined
          ? letters.map(renderLetter)
          : letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: delay + i * stagger,
                  duration,
                  ease: "easeOut",
                }}
                className="text-background inline-block transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                style={outlineStyle}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
      </span>
    </>
  );

  return (
    <span className={cn("group relative inline-flex", className)}>
      {content}
    </span>
  );
}

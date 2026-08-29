"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface HoverShadowBoxProps {
  children: ReactNode;
  className?: string;
  /** Set to fade/slide the box in on mount; omit to render without animation. */
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Wraps any content (link, button, div, ...) with a hard shadow layer that
 * stays fixed in place while the content pops up-and-right on hover.
 * The child element is responsible for its own
 * `group-hover:translate-x-2 group-hover:-translate-y-2` transform classes.
 */
export function HoverShadowBox({
  children,
  className,
  delay,
  duration = 0.5,
  y = 25,
}: HoverShadowBoxProps) {
  const boxClassName = cn("group relative z-100", className);

  const content = (
    <>
      {/* shadow layer — fixed in the original box position */}
      <span aria-hidden className="bg-foreground absolute inset-0" />

      {children}
    </>
  );

  if (delay === undefined) {
    return <div className={boxClassName}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={boxClassName}
    >
      {content}
    </motion.div>
  );
}

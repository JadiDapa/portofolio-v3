"use client";

import { useEffect } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useInViewOnce } from "@/hooks/use-in-view-once";

/**
 * Flags `data-visible` once the strip scrolls into view so its tiles can wipe in.
 * With `boost`, scrolling speeds the rows up and they ease back to their normal pace.
 */
export default function ShowcaseInView({
  children,
  boost,
}: {
  children: React.ReactNode;
  boost?: boolean;
}) {
  const [ref, visible] = useInViewOnce({ threshold: 0.15 });
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const pace = useSpring(
    useTransform(useVelocity(scrollY), (v) => 1 + Math.min(Math.abs(v) / 900, 3)),
    { stiffness: 60, damping: 18 },
  );
  const active = boost && !reduce;

  const setPace = (rate: number) => {
    ref.current?.querySelectorAll(".ct-carousel").forEach((row) => {
      row.getAnimations().forEach((a) => a.updatePlaybackRate(rate));
    });
  };

  useMotionValueEvent(pace, "change", (rate) => {
    if (active) setPace(rate);
  });

  // Hand the rows back at their normal pace if the boost is switched off
  useEffect(() => {
    if (!active) setPace(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div ref={ref} data-visible={visible || undefined}>
      {children}
    </div>
  );
}

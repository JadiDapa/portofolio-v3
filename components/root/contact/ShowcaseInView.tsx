"use client";

import { useInViewOnce } from "@/hooks/use-in-view-once";

/** Flags `data-visible` once the strip scrolls into view so its tiles can wipe in. */
export default function ShowcaseInView({ children }: { children: React.ReactNode }) {
  const [ref, visible] = useInViewOnce({ threshold: 0.15 });

  return (
    <div ref={ref} data-visible={visible || undefined}>
      {children}
    </div>
  );
}

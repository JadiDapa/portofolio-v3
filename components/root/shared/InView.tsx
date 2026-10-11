"use client";

import { useInViewOnce } from "@/hooks/use-in-view-once";

/**
 * Flags `data-visible` on its own element once it scrolls into view, so CSS
 * can run the entrance. Takes over the classes of the wrapper it replaces,
 * which lets server components opt in without adding a box to the layout.
 */
export default function InView({
  threshold = 0.15,
  rootMargin,
  children,
  ...rest
}: {
  threshold?: number;
  rootMargin?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [ref, visible] = useInViewOnce({ threshold, rootMargin });

  return (
    <div ref={ref} data-visible={visible || undefined} {...rest}>
      {children}
    </div>
  );
}

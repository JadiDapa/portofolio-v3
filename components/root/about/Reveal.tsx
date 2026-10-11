"use client";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

/** Rises (or with `x`, slides) into place the first time it scrolls into view. */
export default function Reveal({
  as: Tag = "div",
  x,
  className,
  children,
  ...rest
}: {
  as?: "div" | "li";
  x?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  // The element starts 200px off its slot; trigger a little before it lands.
  const [ref, visible] = useInViewOnce<HTMLElement>({ rootMargin: "0px 0px -10% 0px" });

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      data-visible={visible || undefined}
      className={cn("ab-reveal", x && "ab-reveal--x", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

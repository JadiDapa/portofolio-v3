"use client";

import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLElement>(null);
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
      // The element starts 200px off its slot; trigger a little before it lands.
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

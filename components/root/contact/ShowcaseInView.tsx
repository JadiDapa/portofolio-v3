"use client";

import { useEffect, useRef, useState } from "react";

/** Flags `data-visible` once the strip scrolls into view so its tiles can wipe in. */
export default function ShowcaseInView({ children }: { children: React.ReactNode }) {
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible={visible || undefined}>
      {children}
    </div>
  );
}

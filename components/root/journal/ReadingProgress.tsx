"use client";

import { useEffect, useRef } from "react";

/** A thin pink line across the top of the window that fills as you read down the page. */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={bar} className="jn-progress" aria-hidden />;
}

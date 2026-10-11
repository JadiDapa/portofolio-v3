"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders public-site components at the real viewport width, then zooms the whole
 * canvas down to the pane. Fluid `vi` type and spacing therefore match the live page.
 */
export default function LivePreview({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ zoom: 0.5, width: 1440 });

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const width = Math.max(window.innerWidth, 1024);
      setFit({ width, zoom: el.clientWidth / width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="db-preview">
      <div className="db-preview_bar">
        <span className="db-preview_dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="wk-label">{label}</span>
        <span className="wk-label db-preview_live">Live</span>
      </div>
      <div ref={host} className="db-preview_host">
        <div
          className="db-preview_canvas"
          style={{ width: fit.width, zoom: fit.zoom }}
          inert
        >
          {children}
        </div>
      </div>
    </div>
  );
}

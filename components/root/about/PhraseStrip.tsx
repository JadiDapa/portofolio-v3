"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const SPEED = 63; // px per second, right-to-left

/** 8-point spark, generated so the spokes stay evenly spaced. */
function Spark() {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const r = i % 2 ? 4.2 : 11.5;
    return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 24 24" className="ab-spin" aria-hidden>
      <polygon points={pts} fill="currentColor" />
    </svg>
  );
}

/** Endless, draggable strip of short phrases with spinning sparks between them. */
export default function PhraseStrip({ phrases }: { phrases: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let x = 0;
    let last = performance.now();
    let raf = 0;
    let drag: { start: number; from: number } | null = null;

    // Two identical halves: wrapping by half the width is seamless.
    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (half) x = ((x % half) - half) % half;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      if (!drag && !reduce) x -= SPEED * dt;
      wrap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const down = (e: PointerEvent) => {
      drag = { start: e.clientX, from: x };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (drag) x = drag.from + (e.clientX - drag.start);
    };
    const up = () => {
      drag = null;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [reduce]);

  const items = [...phrases, ...phrases];

  return (
    <div className="ab-strip wk-b ab-glass" data-cmp="strip">
      <div ref={track} className="ab-strip_track">
        {items.map((p, i) => (
          <div
            key={i}
            className="ab-strip_phrase ab-shout"
            aria-hidden={i >= phrases.length || undefined}
          >
            <p>{p}</p>
            <Spark />
          </div>
        ))}
      </div>
    </div>
  );
}

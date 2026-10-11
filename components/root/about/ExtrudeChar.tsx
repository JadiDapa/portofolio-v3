"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

const LAYERS = 8;
const REST = 0.08; // em
const HOVER = 0.14; // em
// Soft, wobbly spring: overshoots to ~2.5× the rest depth before settling.
const SPRING = { type: "spring", stiffness: 50, damping: 5, mass: 1 } as const;

/**
 * One letter of an extruded word: stroked copies stacked up-right with a light
 * face on top. The stack pops out once the letter appears and springs deeper
 * while hovered.
 */
export default function ExtrudeChar({
  char,
  delay,
  zIndex,
}: {
  char: string;
  delay: number;
  zIndex: number;
}) {
  const depth = useMotionValue(0);
  const root = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const layers = root.current?.querySelectorAll<HTMLElement>("[data-layer]") ?? [];
    const paint = (d: number) => {
      layers.forEach((el, i) => {
        const o = ((d * i) / LAYERS).toFixed(4);
        el.style.transform = `translate(${o}em, -${o}em)`;
      });
    };
    paint(depth.get());
    return depth.on("change", paint);
  }, [depth]);

  useEffect(() => {
    const id = setTimeout(() => {
      setShown(true);
      if (reduce) depth.set(REST);
      else animate(depth, REST, { ...SPRING, velocity: 1.66 });
    }, delay * 1000);
    return () => clearTimeout(id);
  }, [delay, depth, reduce]);

  const hover = (on: boolean) => {
    if (!shown || reduce) return;
    animate(depth, on ? HOVER : REST, { ...SPRING, velocity: on ? 1.15 : 0 });
  };

  return (
    <span
      ref={root}
      className="ab-ex-char"
      style={{ zIndex, opacity: shown ? 1 : 0, transition: "opacity 0.12s" }}
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
    >
      <span className="ab-ex-base">{char}</span>
      {Array.from({ length: LAYERS }, (_, i) => (
        <span key={i} data-layer className="ab-ex-layer" aria-hidden>
          {char}
        </span>
      ))}
      <span data-layer aria-hidden>
        <span className="ab-ex-layer">{char}</span>
        <span className="ab-ex-face">{char}</span>
      </span>
    </span>
  );
}

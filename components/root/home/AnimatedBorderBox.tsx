"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

interface AnimatedBorderBoxProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
}

export function AnimatedBorderBox({
  children,
  className = "",
  delay = 0,
  duration = 0.9,
  strokeWidth = 1,
}: AnimatedBorderBoxProps) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const inset = strokeWidth / 2;
  const w = Math.max(width - strokeWidth, 0);
  const h = Math.max(height - strokeWidth, 0);

  return (
    <div ref={ref} className={`text-foreground relative ${className}`}>
      {width > 0 && height > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* top-left -> top-right -> bottom-right */}
          <motion.path
            d={`M ${inset} ${inset} L ${inset + w} ${inset} L ${inset + w} ${inset + h}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration, delay }}
          />
          {/* top-left -> bottom-left -> bottom-right */}
          <motion.path
            d={`M ${inset} ${inset} L ${inset} ${inset + h} L ${inset + w} ${inset + h}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration, delay }}
          />
        </svg>
      )}
      {children}
    </div>
  );
}

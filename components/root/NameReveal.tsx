"use client";

import { useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";

const NAME = "DAFFA ALTHAF";

// Letters fade in while rising, then settle with a small
// up-down-up-down bounce, staggered left to right. Plays the first time the
// wordmark scrolls into view; click to replay.
export default function NameReveal() {
  const [playKey, setPlayKey] = useState(0);
  const [ref, started] = useInViewOnce<HTMLParagraphElement>({ threshold: 0.3 });

  const replay = () => setPlayKey((k) => k + 1);

  return (
    <p
      ref={ref}
      onClick={replay}
      title="Click to replay"
      aria-label={NAME}
      className="hm-wordmark cursor-pointer select-none"
    >
      <style>{`
        @keyframes letter-rise {
          0% { opacity: 0; transform: translateY(0.6em); }
          50% { opacity: 1; transform: translateY(-0.12em); }
          65% { transform: translateY(0.06em); }
          80% { transform: translateY(-0.03em); }
          90% { transform: translateY(0.015em); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <span className="hm-wordmark-inner">
      {NAME.split("").map((ch, i) => (
        <span
          key={`${playKey}-${i}`}
          aria-hidden
          className="inline-block"
          style={{
            opacity: 0,
            width: ch === " " ? "0.22em" : undefined,
            animationName: started ? "letter-rise" : "none",
            animationDuration: "0.9s",
            animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            animationFillMode: "forwards",
            animationDelay: `${i * 0.035}s`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
      </span>
    </p>
  );
}

"use client";

import { useState } from "react";

const NAME = "Daffa Althaf R.";

// Letters fade in while rising, then settle with a small
// up-down-up-down bounce, staggered left to right.
export default function NameReveal() {
  const [playKey, setPlayKey] = useState(0);

  const replay = () => setPlayKey((k) => k + 1);

  return (
    <p
      onClick={replay}
      title="Click to replay"
      className="mt-10 cursor-pointer overflow-hidden text-[10rem] leading-[0.8] font-bold tracking-tighter uppercase select-none"
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
      {NAME.split("").map((ch, i) => (
        <span
          key={`${playKey}-${i}`}
          className="text-foreground inline-block"
          style={{
            opacity: 0,
            width: ch === " " ? "0.28em" : undefined,
            animation:
              "letter-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            animationDelay: `${i * 0.035}s`,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </p>
  );
}

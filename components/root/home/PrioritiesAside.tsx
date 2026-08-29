"use client";

import { useState } from "react";
import { Clock, DollarSign, Smile, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  { key: "quality", label: "Highest Quality", icon: ThumbsUp },
  { key: "deadline", label: "Tight Deadline", icon: Clock },
  { key: "cost", label: "Low Cost", icon: DollarSign },
] as const;

type PriorityKey = (typeof PRIORITIES)[number]["key"];

// The classic quality/speed/cost triangle: pick two, the third gives.
const OUTCOMES: Record<string, string> = {
  "quality,deadline": "Great, fast work — expect a premium budget.",
  "quality,cost": "Great, affordable work — expect a longer timeline.",
  "deadline,cost": "Fast, affordable work — expect a leaner scope.",
};

export default function PrioritiesAside() {
  const [selected, setSelected] = useState<PriorityKey[]>([
    "quality",
    "deadline",
  ]);

  function toggle(key: PriorityKey) {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      const next = [...prev, key];
      return next.length > 2 ? next.slice(1) : next;
    });
  }

  const comboKey = PRIORITIES.filter((p) => selected.includes(p.key))
    .map((p) => p.key)
    .join(",");

  const message =
    selected.length === 2
      ? OUTCOMES[comboKey]
      : "Pick two and I'll work around them.";

  return (
    <aside className="space-y-3">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        What matters most?
      </p>

      {PRIORITIES.map(({ key, label, icon: Icon }) => {
        const isOn = selected.includes(key);

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isOn}
            onClick={() => toggle(key)}
            className="border-foreground flex w-full items-center justify-between border px-4 py-3 text-sm font-medium"
          >
            {label}
            <span
              className={cn(
                "relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border transition-colors",
                isOn
                  ? "border-foreground bg-foreground"
                  : "border-foreground bg-background",
              )}
            >
              <span
                className={cn(
                  "absolute flex size-7 items-center justify-center rounded-full transition-all",
                  isOn
                    ? "right-1 bg-background text-foreground"
                    : "left-1 bg-foreground text-background",
                )}
              >
                <Icon className="size-4" />
              </span>
            </span>
          </button>
        );
      })}

      <div className="border-foreground flex items-center gap-3 border px-4 py-3">
        <Smile className="size-5 shrink-0" />
        <p className="text-muted-foreground text-xs">{message}</p>
      </div>
    </aside>
  );
}

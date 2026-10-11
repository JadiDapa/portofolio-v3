"use client";

import { useState } from "react";
import { Clock, DollarSign, Smile, ThumbsUp, X } from "lucide-react";
import GridButton from "@/components/root/work/GridButton";

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
  const [selected, setSelected] = useState<PriorityKey[]>(["quality", "deadline"]);
  const [info, setInfo] = useState(false);

  // Always two of three. Switching one off brings the third on; switching
  // cost on drops quality (and the other way round), deadline drops the oldest.
  function toggle(key: PriorityKey) {
    setSelected((prev) => {
      if (prev.includes(key)) {
        const third = PRIORITIES.find((p) => !prev.includes(p.key))!.key;
        return [...prev.filter((k) => k !== key), third];
      }
      const opposite =
        key === "cost" ? "quality" : key === "quality" ? "cost" : prev[0];
      const drop = prev.includes(opposite) ? opposite : prev[0];
      return [...prev.filter((k) => k !== drop), key];
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
    <aside className="hm-enq-aside col-span-full lg:col-span-1">
      {PRIORITIES.map(({ key, label, icon: Icon }) => {
        const on = selected.includes(key);
        return (
          <div key={key} className="wk-b wk-glass p-(--space-s-m)">
            <button
              type="button"
              role="switch"
              aria-checked={on}
              data-state={on ? "checked" : "unchecked"}
              onClick={() => toggle(key)}
              className="hm-switch"
            >
              <span className="hm-switch-track">
                <Icon className="hm-switch-icon" strokeWidth={1.3} aria-hidden />
                <span className="hm-switch-knob">
                  <Icon strokeWidth={1.3} aria-hidden />
                </span>
              </span>
              <span className="hm-switch-label">{label}</span>
            </button>
          </div>
        );
      })}

      <div className="hm-enq-info">
        <GridButton
          icon
          dark={info}
          ariaLabel={info ? "Hide info" : "Show info"}
          onClick={() => setInfo((v) => !v)}
          className="hm-info-btn"
        >
          {info ? (
            <X strokeWidth={1.2} aria-hidden />
          ) : (
            <Smile strokeWidth={1.2} aria-hidden />
          )}
        </GridButton>
        <div className="hm-info-panel" data-open={info || undefined}>
          <div className="hm-info-inner">
            <div className="hm-info-content">
              <p className="hm-info-lead">
                Every project is a balancing act of quality, speed and cost.
                It&apos;s the classic conundrum…
              </p>
              <p className="hm-info-text">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

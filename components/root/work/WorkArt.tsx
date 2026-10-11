const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** 4-point star centred on (cx, cy) with radius r. */
function star(cx: number, cy: number, r: number) {
  const k = r * 0.18;
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`;
}

/** Lamp-over-pyramid mark that sits between "Project" and "Showcase". */
export function LabelArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <g {...STROKE}>
        <circle cx="24" cy="9" r="4.6" />
        <path d="M22 14.4h4M22.6 16.4h2.8" />
        <path d="M24 18 13.5 39.5M24 18l10.5 21.5" />
        <path d="M10 39.5h28" />
        <path d="M21.5 27h5v12.5h-5z" />
        <path d="M24 22.5v1.5" />
        <path d={star(6.5, 29, 3.2)} />
        <path d={star(41.5, 29, 3.2)} />
      </g>
    </svg>
  );
}

/** Index passed to the stylesheet so each shape can run on its own beat. */
const beat = (k: number) => ({ "--k": k }) as React.CSSProperties;

/** Sparkle cluster pinned to the corner of the "Expertise" heading. */
export function SparkleArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <g {...STROKE} className="hm-spark">
        <path d={star(15, 31, 11)} pathLength={1} style={beat(0)} />
        <path d={star(33, 14, 5.5)} pathLength={1} style={beat(1)} />
        <path d={star(35, 36, 3.6)} pathLength={1} style={beat(2)} />
      </g>
    </svg>
  );
}

/** Three overlapping speech bubbles — the Enquiry label art. */
export function ChatArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <g {...STROKE}>
        <path d="M4 12.5h12.5a2 2 0 0 1 2 2V24a2 2 0 0 1-2 2H11l-3.5 3.5V26H4a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z" transform="translate(0 6)" className="hm-bob" style={beat(0)} />
        <path d="M31.5 12.5H44a2 2 0 0 1 2 2V24a2 2 0 0 1-2 2h-3.5V29.5L37 26h-5.5a2 2 0 0 1-2-2v-9.5a2 2 0 0 1 2-2Z" transform="translate(0 6)" className="hm-bob" style={beat(2)} />
        <path d="M17.5 4H30.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H26l-3 3.5L20 19h-2.5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" className="hm-bob" style={beat(1)} />
        <path d="M24 8.2v6.6M20.7 11.5h6.6" />
      </g>
    </svg>
  );
}

/** Scalloped rosette with a tick, flanked by two megaphones — the Reviews label art. */
export function ReviewArt() {
  // Twelve outward-bulging arcs make the scalloped edge
  const n = 12;
  const r = 10.5;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [24 + Math.cos(a) * r, 24 + Math.sin(a) * r] as const;
  });
  const scallop =
    pts
      .map(([x, y], i) => {
        const [nx, ny] = pts[(i + 1) % n];
        return `${i === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : ""}A3 3 0 0 1 ${nx.toFixed(2)} ${ny.toFixed(2)}`;
      })
      .join("") + "Z";
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <g {...STROKE}>
        <path d={scallop} className="hm-rosette" />
        <path d="m19.5 24 3 3 6-6.5" />
        <path d="M11 20 4 17.5v13L11 28z" />
        <path d="M6.5 30.5v6h4v-5" />
        <path d="M37 20l7-2.5v13L37 28z" />
        <path d="M41.5 30.5v6h-4v-5" />
      </g>
    </svg>
  );
}

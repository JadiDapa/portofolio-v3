"use client";

import { useState } from "react";
import HalftonePhoto from "./HalftonePhoto";

const HATS = [
  { name: "The Engineer", role: "Software Engineer", src: "/about/portrait-software.jpg" },
  { name: "The Tinkerer", role: "Electrical Engineer", src: "/about/portrait-electrical.jpg" },
  { name: "The Human", role: "Off the clock", src: "/about/portrait-offclock.jpg" },
];

function Portrait({ hat }: { hat: (typeof HATS)[number] }) {
  // "enter" / "leave" drive the inset frame animation in both directions.
  const [cursor, setCursor] = useState<"enter" | "leave" | undefined>();

  return (
    <div
      className="ab-portrait"
      data-cursor={cursor}
      onPointerEnter={(e) => e.pointerType === "mouse" && setCursor("enter")}
      onPointerLeave={(e) => e.pointerType === "mouse" && setCursor("leave")}
    >
      <div className="ab-portrait_lift">
        <div className="ab-portrait_frame wk-b">
          <div className="ab-portrait_media">
            <HalftonePhoto
              src={hat.src}
              alt={`${hat.name}, ${hat.role}`}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 60vw, 90vw"
            />
          </div>
        </div>
        <div className="ab-portrait_name wk-b ab-glass ab-p">
          <p className="ab-title truncate">{hat.name}</p>
        </div>
        <div className="wk-b ab-glass flex h-(--ab-grid) w-fit items-center px-(--space-s-m)">
          <p className="ab-tag">{hat.role}</p>
        </div>
      </div>
    </div>
  );
}

/** Three cards side by side on desktop; a swipeable snapping row below that. */
export default function AboutPortraits() {
  return (
    <section data-cmp="portraits">
      <div className="ab-portraits_track -my-[1em] snap-x snap-mandatory overflow-x-auto py-[1em] [scrollbar-width:none] lg:my-0 lg:overflow-visible lg:py-0 [&>*]:snap-start">
        {HATS.map((hat) => (
          <Portrait key={hat.role} hat={hat} />
        ))}
      </div>
    </section>
  );
}

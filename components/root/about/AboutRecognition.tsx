"use client";

import { ArrowUpRight } from "lucide-react";
import type { Recognition } from "@/generated/prisma";
import AboutTitle from "./AboutTitle";
import Reveal from "./Reveal";

const KIND_LABEL: Record<Recognition["kind"], string> = {
  AWARD: "Award",
  PRESS: "Press",
  CERTIFICATION: "Certificate",
  COMPETITION: "Competition",
};

/** Records which edge the cursor came in from so the fill grows from there. */
function setOrigin(e: React.PointerEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const fromTop = e.clientY - r.top < r.height / 2;
  e.currentTarget.style.setProperty("--origin", fromTop ? "top" : "bottom");
}

function Row({ item }: { item: Recognition }) {
  const body = (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      <div className="ab-rec-cell ab-px wk-b">
        <p className="ab-strong truncate">{item.source}</p>
      </div>
      <div className="ab-rec-cell ab-rec-kind ab-px wk-b">
        <p className="wk-label">{KIND_LABEL[item.kind]}</p>
      </div>
      <div className="col-span-2 flex">
        <div className="ab-rec-cell ab-px wk-b grow">
          <p className="ab-subtext">
            {item.title}
            {item.year ? ` — ${item.year}` : ""}
          </p>
        </div>
        <div className="ab-tile wk-b" aria-hidden>
          <ArrowUpRight strokeWidth={1} />
        </div>
      </div>
    </div>
  );

  return (
    <Reveal as="li" x>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          onPointerEnter={setOrigin}
          onPointerLeave={setOrigin}
        >
          {body}
        </a>
      ) : (
        <a onPointerEnter={setOrigin} onPointerLeave={setOrigin}>
          {body}
        </a>
      )}
    </Reveal>
  );
}

export default function AboutRecognition({ items }: { items: Recognition[] }) {
  if (items.length === 0) return null;

  return (
    <section data-cmp="recognition">
      <AboutTitle
        cmp="recTitle"
        className="wk-pad"
        boxed={false}
        compact
        left="Hard won"
        right="Well earned"
        heading="Recognition"
        opening="A few moments where the work got noticed by people who know the craft."
        inView
      />
      <ul className="ab-rec ab-glass">
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

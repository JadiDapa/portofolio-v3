"use client";

import { Settings } from "lucide-react";
import RevealHeading from "@/components/root/work/RevealHeading";
import type { ProcessStep } from "@/servers/validators/service.validator";

export default function ServiceProcess({
  steps,
  title,
}: {
  steps: ProcessStep[];
  title: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section className="py-(--space-l-xl)">
      <div className="wk-grid">
        <div className="order-1 col-span-2 flex justify-end lg:col-start-3 lg:row-start-1 lg:justify-start">
          <div data-cmp="howTile" className="sv-tile wk-b flex">
            <Settings strokeWidth={1} aria-hidden />
          </div>
        </div>

        <div className="relative order-2 col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div
            data-cmp="howHead"
            className="sd-how-head wk-b wk-glass space-y-(--space-3xs-2xs) p-(--space-s-m) sm:p-(--space-l-xl)"
          >
            <h2 className="sd-subheading text-center text-balance">
              <RevealHeading text="How I work" inView breakAfter={1} />
            </h2>
            <p className="wk-type-text mx-auto text-center text-balance">
              A look at how a typical {title} project comes together
            </p>
          </div>
        </div>

        <ul className="order-3 col-span-2 lg:col-start-3 lg:row-start-2">
          {steps.map((step, i) => (
            <li key={i}>
              <article data-cmp={i === 0 ? "step1" : undefined} className="sd-step wk-b">
                <p className="sd-step-num wk-label">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0 grow space-y-(--space-s-m)">
                  <p className="sd-title">{step.title}</p>
                  <p className="sv-subtext">{step.text}</p>
                  {step.outcomes.length > 0 && (
                    <div className="space-y-(--space-3xs-2xs)">
                      <p className="wk-label text-[#b3b3b3]">Outcomes</p>
                      <ul className="sd-outcomes">
                        {step.outcomes.map((outcome, j) => (
                          <li key={j}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

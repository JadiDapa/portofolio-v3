"use client";

import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import RevealHeading from "@/components/root/work/RevealHeading";
import type { Faq } from "@/servers/validators/service.validator";
import ServiceLink from "./ServiceLink";

export default function ServiceFaq({
  faqs,
  title,
}: {
  faqs: Faq[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  const toggle = (i: number) => setOpen((cur) => (cur === i ? null : i));

  return (
    <section className="wk-grid pt-(--space-l-xl)">
      <div className="order-2 col-span-2 lg:order-1">
        <div className="hidden justify-end lg:flex">
          <div data-cmp="faqTile" className="sv-tile wk-b flex">
            <MessageCircle strokeWidth={1} aria-hidden />
          </div>
        </div>

        <ul data-cmp="acc" className="sd-acc">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                className="sd-acc-item"
                data-open={isOpen || undefined}
              >
                <button
                  type="button"
                  className="sd-acc-trigger wk-b"
                  aria-label={isOpen ? "Collapse answer" : "Expand answer"}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => toggle(i)}
                >
                  <svg viewBox="0 0 24 24" className="sd-acc-icon" aria-hidden>
                    <path
                      d="M12 2v20M2 12h20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>

                <article className="wk-b min-w-0 grow">
                  <button
                    type="button"
                    className="sd-acc-header"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <p className="sd-title">{faq.question}</p>
                  </button>
                  <div id={`faq-${i}`} className="sd-acc-body" role="region">
                    <div>
                      <div className="sd-acc-area">
                        <p className="sv-subtext">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="order-1 col-span-2 lg:order-2">
        <div
          data-cmp="faqSide"
          className="wk-b wk-glass space-y-(--space-3xs-2xs) p-(--space-s-m) sm:p-(--space-l-xl)"
        >
          <h2 className="sd-subheading text-center text-balance">
            <RevealHeading text="Common Questions" inView />
          </h2>
          <p className="wk-type-text mx-auto text-center text-balance">
            Answers to what people ask most about {title}
          </p>
        </div>

        <div className="hidden grid-cols-4 lg:grid">
          <div className="col-span-2 col-start-3">
            <ServiceLink href="/contact" label="Get in touch" Icon={Sparkles} />
          </div>
        </div>
      </div>
    </section>
  );
}

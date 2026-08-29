"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Asterisk } from "lucide-react";
import { Testimonial } from "@/generated/prisma";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="px-gutter py-24">
      {/* Centered header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-eyebrow flex items-center justify-center gap-3 font-medium tracking-[0.2em] uppercase">
          <span>Five Star</span>
          <Asterisk className="text-primary size-5" />
          <span>Reviews</span>
        </p>

        <h2 className="text-section mt-6 leading-[0.9] font-bold tracking-tight uppercase">
          Testimonials
        </h2>

        <p className="text-lead mt-6">
          Hear from the people I&apos;ve helped along the way
        </p>
      </div>

      {/* Carousel */}
      <div className="mx-auto">
        {/* Top bar: corner arrows */}
        <div className="border-foreground flex items-stretch justify-between">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() =>
              setIndex(
                (i) => (i - 1 + testimonials.length) % testimonials.length,
              )
            }
            className="border-foreground hover:bg-foreground hover:text-background flex size-20 items-center justify-center border border-r transition-colors md:size-16"
          >
            <ArrowLeft className="size-8" />
          </button>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            className="border-foreground hover:bg-foreground hover:text-background flex size-20 items-center justify-center border border-r transition-colors md:size-16"
          >
            <ArrowRight className="size-8" />
          </button>
        </div>

        {/* Accordion strip: active card expands, others shrink into tabs */}
        <div className="border-foreground flex h-120 items-stretch overflow-hidden border">
          {testimonials.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                style={{
                  flexGrow: active ? 6 : 1,
                  flexBasis: 0,
                  minWidth: active ? undefined : "3.5rem",
                }}
                className={cn(
                  "border-foreground min-w-0 border-l text-left transition-all duration-500 ease-out first:border-l-0",
                  active
                    ? "bg-background text-foreground p-8 md:p-12"
                    : "bg-foreground text-background flex items-center justify-center p-3",
                )}
              >
                {active ? (
                  <>
                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase">
                      {t.company}
                    </p>
                    <p className="text-title mt-6 leading-snug font-light">
                      {t.quote}
                    </p>
                    <footer className="mt-8">
                      <p className="text-sm font-semibold">{t.authorName}</p>
                      <p className="text-muted-foreground text-sm">
                        {t.authorTitle}
                      </p>
                    </footer>
                  </>
                ) : (
                  <span className="rotate-180 text-sm font-bold tracking-widest uppercase [writing-mode:vertical-rl]">
                    {t.company?.split(" ")[0] ?? t.authorName.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

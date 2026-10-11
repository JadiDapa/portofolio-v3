"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useMotionValue, motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Testimonial } from "@/generated/prisma";
import GridButton from "@/components/root/work/GridButton";
import SectionTitle from "@/components/root/home/SectionTitle";
import { ReviewArt } from "@/components/root/work/WorkArt";
import { cn } from "@/lib/utils";

// Measured on the reference: the progress bar under the active logo fills in 7.55s
const AUTOPLAY_MS = 7550;
// Critically damped spring, fitted to the reference's slide (≈1s, soft landing)
const SLIDE = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;
const EASE = [0.19, 1, 0.22, 1] as const;

/**
 * The quote, word by word. When its card becomes the active one the words
 * rise in turn; inactive cards render plain, so nothing moves while they sit grey.
 */
function QuoteWords({
  text,
  active,
  ready,
}: {
  text: string;
  active: boolean;
  /** The section has scrolled into view, so the first card may start. */
  ready: boolean;
}) {
  return (
    // remount on activation so the stagger replays for each card
    <span key={active ? "on" : "off"}>
      {text.split(" ").map((word, i, all) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            initial={active ? { opacity: 0, y: "0.45em" } : false}
            animate={ready || !active ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: Math.min(i * 0.018, 0.9), ease: EASE }}
          >
            {word}
          </motion.span>
          {i < all.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/**
 * Contained slider: the active card sits centred, the first and last card hug
 * the edges, and the neighbours peek in grey on either side.
 */
export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { once: true, amount: 0.2 });
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(0.7);
  const x = useMotionValue(0);
  const count = testimonials.length;

  // Cards are 70% of the viewport wide on desktop, 90% below 1024px
  const cardWidth = width * ratio;

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      setRatio(window.innerWidth >= 1024 ? 0.7 : 0.9);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  useEffect(() => {
    if (!width) return;
    const centred = (width - cardWidth) / 2 - index * cardWidth;
    const min = -(count * cardWidth - width);
    const target = Math.min(0, Math.max(min, centred));
    if (x.get() === 0 && index === 0) x.set(target);
    else animate(x, target, SLIDE);
  }, [index, width, cardWidth, count, x]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, count]);

  if (count === 0) return null;

  // The logo row shows four at a time, sliding along with the active card
  const first = Math.min(Math.max(0, index - 1), Math.max(0, count - 4));
  const visibleLogos = testimonials.slice(first, first + 4);

  return (
    <section ref={section} className="px-gutter pt-(--gutter-pad)" data-sec="testimonials">
      <SectionTitle
        className="pt-(--gutter-pad)"
        labelLeft="Five star"
        labelRight="Reviews"
        art={<ReviewArt />}
        heading="*Testimonials*"
        opening="Hear from the people I've helped along the way"
      />

      <div className="hm-tc">
        <motion.div
          className="hm-tc-arrow hm-tc-arrow--prev hidden lg:block"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          <GridButton
            icon
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            ariaLabel="Previous testimonial"
            className="hm-menu-btn hm-arrow-btn"
          >
            <ArrowLeft strokeWidth={1.2} aria-hidden />
          </GridButton>
        </motion.div>
        <motion.div
          className="hm-tc-arrow hm-tc-arrow--next hidden lg:block"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
        >
          <GridButton
            icon
            disabled={index === count - 1}
            onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
            ariaLabel="Next testimonial"
            className="hm-menu-btn hm-arrow-btn"
          >
            <ArrowRight strokeWidth={1.2} aria-hidden />
          </GridButton>
        </motion.div>

        <motion.div
          className="hm-tc-viewport wk-b"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div ref={viewport} className="hm-tc-clip">
          <motion.ul className="hm-tc-track" style={{ x }}>
            {testimonials.map((t, i) => (
              <li
                key={t.id}
                style={{ flexBasis: `${ratio * 100}%` }}
                className={cn("hm-tc-card", i === index && "hm-tc-card--active")}
                aria-hidden={i !== index}
              >
                <p className="hm-tc-company wk-label">{t.company}</p>
                <blockquote className="hm-tc-quote">
                  <QuoteWords text={t.quote} active={i === index} ready={inView} />
                </blockquote>
                <footer className="hm-tc-author">
                  <strong>{t.authorName}</strong>
                  {t.authorTitle && <span>{t.authorTitle}</span>}
                </footer>
              </li>
            ))}
          </motion.ul>
          </div>
        </motion.div>
      </div>

      <ul className="hm-tc-logos">
        {visibleLogos.map((t, i) => {
          const active = first + i === index;
          return (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.09, ease: EASE }}
            >
              <button
                type="button"
                className="hm-tc-logo"
                data-active={active || undefined}
                aria-label={t.company ?? t.authorName}
                aria-current={active || undefined}
                onClick={() => setIndex(first + i)}
              >
                {active && (
                  <span
                    key={index}
                    aria-hidden
                    className="hm-tc-timer"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
                {t.logo ? (
                  <Image
                    src={t.logo}
                    alt=""
                    width={240}
                    height={90}
                    className="hm-tc-logo-img"
                  />
                ) : (
                  <span className="hm-tc-logo-text">{t.company ?? t.authorName}</span>
                )}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

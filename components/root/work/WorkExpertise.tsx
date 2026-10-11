"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { Service } from "@/generated/prisma";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";
import { SparkleArt } from "./WorkArt";
import RevealHeading from "./RevealHeading";

const ARROW =
  "M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173";

// Cards drift in from below; the order they land in mirrors the staggered
// vertical offsets of the grid (3rd first, 1st last).
const ENTER_DELAY = [0.36, 0.18, 0, 0.18];

function ExpertiseCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // Observe the <li>, not the motion node: the node's own 200px offset would
  // otherwise keep a card near the fold out of view forever.
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const Icon = SERVICE_ICONS[service.slug] ?? DEFAULT_SERVICE_ICON;

  return (
    <li ref={ref} data-cmp={`exp${index + 1}`} className="wk-exp-item">
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: 0.9,
          delay: ENTER_DELAY[index] ?? 0,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        <Link href={`/services/${service.slug}`} data-cmp="card" className="wk-exp-link">
          <div className="wk-exp-wrap wk-b">
            <div className="wk-exp-ctx">
              <div className="wk-exp-icons">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMin meet"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d={ARROW}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
                <Icon
                  className="wk-exp-icon"
                  strokeWidth={1.1}
                  aria-hidden
                />
              </div>

              <div className="wk-exp-content">
                <div className="wk-exp-heading">
                  <p className="text-(length:--step-2) leading-[1.25em] font-medium tracking-[-0.03em]">
                    {service.title}
                  </p>
                </div>
                <p className="text-(length:--step-0) leading-[1.4em] tracking-[0.008em]">
                  {service.summary}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </li>
  );
}

export default function WorkExpertise({
  services,
  heading = "Expertise",
  opening = "Software, electronics, AI — I'll find a technical solution for whatever problem your product runs into.",
  action,
}: {
  services: Service[];
  heading?: React.ReactNode;
  opening?: string;
  /** Button pinned to the fourth column, level with the heading (home page). */
  action?: React.ReactNode;
}) {
  return (
    <section className="space-y-(--space-xl-2xl) pt-(--space-xl-2xl)">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 space-y-(--space-s-m) px-(--space-xs-s) sm:col-span-3">
          <div className="relative w-fit" data-cmp="expTitle">
            <p className="wk-heading wk-heading--sm">
              {typeof heading === "string" ? (
                <RevealHeading text={heading} inView />
              ) : (
                <span className="mr-[-0.12em] block">{heading}</span>
              )}
            </p>
            <span className="absolute -top-[1.9em] -right-[2.4em] size-[2.7em] text-(length:--space-m)">
              <SparkleArt />
            </span>
          </div>
          <p data-cmp="expOpening" className="wk-opening max-w-[26em]">
            {opening}
          </p>
        </div>
        {action && (
          <div data-cmp="expAction" className="col-span-2 lg:col-span-1 lg:col-start-4 lg:row-start-1">
            {action}
          </div>
        )}
      </div>

      <ul className="grid grid-cols-2 pt-(--space-xl-2xl) lg:grid-cols-4">
        {services.slice(0, 4).map((service, i) => (
          <ExpertiseCard key={service.id} service={service} index={i} />
        ))}
      </ul>
    </section>
  );
}

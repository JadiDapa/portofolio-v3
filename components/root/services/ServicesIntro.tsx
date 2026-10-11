"use client";

import { motion } from "motion/react";
import { Cpu } from "lucide-react";

// Boxes rise 200px into place as they scroll in; the second lands a beat later.
// The travel decays exponentially (~230ms time constant) rather than following
// a bezier, and opacity fades in linearly over the first ~200ms.
const DECAY = 8.8;
const decay = (p: number) => (1 - Math.exp(-DECAY * p)) / (1 - Math.exp(-DECAY));

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 200 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: {
    y: { duration: 2, delay: 0.095 + delay, ease: decay },
    opacity: { duration: 0.21, delay: 0.095 + delay, ease: "linear" as const },
  },
});

export default function ServicesIntro() {
  return (
    <section className="wk-grid">
      <div className="col-span-2">
        <motion.div
          data-cmp="introHeading"
          className="sv-intro-heading wk-b wk-glass p-(--space-s-m)"
          {...rise(0)}
        >
          <p className="sv-subtitle text-balance">
            One engineer for the whole stack. I care about the circuit board
            as much as the screen people actually touch, and I like hard
            problems that need&nbsp;both.
          </p>
        </motion.div>
      </div>

      <div className="col-span-2 flex items-start">
        <motion.div
          data-cmp="introText"
          className="sv-intro-text wk-b wk-glass grow space-y-(--space-s-m) p-(--space-s-m)"
          {...rise(0.2)}
        >
          <p className="wk-opening text-balance">
            An Electrical Engineering degree and years of shipping software
            mean I can take an idea from a rough schematic all the way to a
            deployed, maintained product without handing it&nbsp;off.
          </p>
          <p className="sv-subtext text-balance">
            Web and mobile apps, machine-learning features, IoT devices and
            the PCBs inside them — every project gets the full toolkit, so
            there are fewer gaps between the parts and a sturdier result.
          </p>
        </motion.div>

        <div data-cmp="introTile" className="sv-tile wk-b hidden lg:flex">
          <Cpu strokeWidth={1} aria-hidden />
        </div>
      </div>
    </section>
  );
}

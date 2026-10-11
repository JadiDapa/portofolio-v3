"use client";

import { useEffect, useRef, useState } from "react";
import { pad2 } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Stars, ArrowRight } from "lucide-react";
import { AnimatedBorderBox } from "./AnimatedBorderBox";
import { HoverShadowBox } from "@/components/root/HoverShadowBox";
import { WigglyText } from "../WigglyText";

const specialties = [
  "Electrical & Robotics",
  "Software Engineering",
  "Control & Automation",
];

const GREETING = "Hi! Im Daffa Althaf R";
const DESCRIPTION =
  "Electrical & Control Engineer with a Software Engineering edge, building innovative solutions where engineering meets technology.";

// Entry sequence: portrait -> name -> skills -> typewriter
const PORTRAIT_DELAY_MS = 100;
const PORTRAIT_DURATION_MS = 450;

const NAME_DAFFA_DELAY_MS = 300;
const NAME_ALTHAF_DELAY_MS = 440;
const NAME_STAGGER_MS = 30;
const NAME_DURATION_MS = 350;
const NAME_LETTER_COUNT = 6; // ALTHAF, the longer of the two words
const NAMES_END_MS =
  NAME_ALTHAF_DELAY_MS + NAME_LETTER_COUNT * NAME_STAGGER_MS + NAME_DURATION_MS;

const SKILLS_START_S = NAMES_END_MS / 1000 + 0.05;
const SKILLS_STAGGER_S = 0.08;
const SKILLS_DURATION_S = 0.35;
const SKILLS_END_S =
  SKILLS_START_S + 2 * SKILLS_STAGGER_S + SKILLS_DURATION_S;

const GREETING_START_DELAY = SKILLS_END_S * 1000 + 50;
const GREETING_SPEED = 22;
const GREETING_DURATION =
  GREETING_START_DELAY + GREETING.length * GREETING_SPEED;
const DESCRIPTION_SPEED = 7;
const DESCRIPTION_START_DELAY = GREETING_DURATION + 80;
const DESCRIPTION_DURATION =
  DESCRIPTION_START_DELAY + DESCRIPTION.length * DESCRIPTION_SPEED;
const DESCRIPTION_END_S = DESCRIPTION_DURATION / 1000;

function useTypewriter(text: string, speed = 45, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return displayed;
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Scrolling away: the names part ways and the portrait lags behind the page.
  // Every value is 0 at the top, so the resting composition is untouched.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const reach = reduce ? 0 : 1;
  const daffaX = useTransform(scrollYProgress, [0, 1], [0, -70 * reach]);
  const althafX = useTransform(scrollYProgress, [0, 1], [0, 70 * reach]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", `${9 * reach}%`]);
  const typedGreeting = useTypewriter(
    GREETING,
    GREETING_SPEED,
    GREETING_START_DELAY,
  );
  const typedDescription = useTypewriter(
    DESCRIPTION,
    DESCRIPTION_SPEED,
    DESCRIPTION_START_DELAY,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % specialties.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={section} className="px-gutter">
      <h1 className="sr-only">
        Daffa Althaf Ridovani — Software Engineer &amp; Electrical Engineer
      </h1>
      <AnimatedBorderBox delay={0} duration={1.2}>
        <div className="hm-hero">
          {/* Intro */}
          <div className="hm-hero_intro">
            <p className="hm-hero_greet">
              {typedGreeting}
              <motion.span
                aria-hidden
                className="bg-foreground ml-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] align-middle"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </p>

            <p className="hm-hero_desc">
              {typedDescription}
            </p>
          </div>

          {/* DAFFA */}
          <motion.div className="hm-hero_daffa" style={{ x: daffaX }}>
            <WigglyText
              text="DAFFA"
              className="hm-hero_name"
              delay={NAME_DAFFA_DELAY_MS / 1000}
              stagger={NAME_STAGGER_MS / 1000}
              y={40}
              duration={NAME_DURATION_MS / 1000}
            />
          </motion.div>

          {/* ALTHAF */}
          <motion.div className="hm-hero_althaf" style={{ x: althafX }}>
            <WigglyText
              text="ALTHAF"
              className="hm-hero_name"
              delay={NAME_ALTHAF_DELAY_MS / 1000}
              stagger={NAME_STAGGER_MS / 1000}
              y={40}
              duration={NAME_DURATION_MS / 1000}
            />
          </motion.div>

          {/* Portrait. The wrapper carries the scroll drift (and the stacking
              slot) so the entrance below keeps sole control of its own y. */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ y: portraitY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: PORTRAIT_DURATION_MS / 1000,
                delay: PORTRAIT_DELAY_MS / 1000,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hm-hero_portrait"
            >
              <Image
                src="/images/self-hero-123.png"
                alt="Portrait"
                width={1120}
                height={1400}
                sizes="(min-width: 48rem) 46vw, 92vw"
                className="size-full object-contain object-bottom"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Specialties */}
          <div className="hm-hero_skills">
            {specialties.map((specialty, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={specialty}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: SKILLS_DURATION_S,
                    delay: SKILLS_START_S + index * SKILLS_STAGGER_S,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.div
                    animate={{
                      x: isActive ? "2.2cqw" : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="hm-hero_skill"
                  >
                    {/* Number */}
                    <motion.span
                      animate={{
                        color: isActive
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="hm-hero_num"
                    >
                      ({pad2(index + 1)})
                    </motion.span>

                    {/* Specialty */}
                    <motion.span
                      animate={{
                        color: isActive
                          ? "var(--foreground)"
                          : "var(--muted-foreground)",
                      }}
                      transition={{
                        duration: 0.4,
                      }}
                      className="hm-hero_spec"
                    >
                      {specialty}
                    </motion.span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedBorderBox>

      {/* CTA */}
      <div className="page-grid">
        <HoverShadowBox
          delay={DESCRIPTION_END_S + 0.1}
          className="-translate-y-px md:col-start-2"
        >
          <Link
            href="/work"
            className="border-foreground bg-background relative flex translate-x-0 translate-y-0 items-center justify-between gap-3 border px-6 py-8 font-medium tracking-wide uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
          >
            <span className="flex items-center gap-3">
              <ArrowRight className="size-4 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
              View my works
            </span>

            <Stars className="size-6 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" />
          </Link>
        </HoverShadowBox>
      </div>
    </section>
  );
}

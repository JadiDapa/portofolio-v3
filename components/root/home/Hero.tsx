"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, LayoutGrid, Stars, ArrowRight } from "lucide-react";
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
    <section className="px-gutter">
      <AnimatedBorderBox delay={0} duration={1.2}>
        <div className="relative mx-auto flex h-[70vh] flex-col items-center overflow-hidden px-6">
          {/* Intro */}
          <div className="absolute top-12 right-[2%] z-30 flex max-w-xs flex-col italic">
            <p className="mb-4 text-lg font-medium italic">
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

            <p className="text-sm font-medium italic">
              {typedDescription}
            </p>
          </div>

          {/* DAFFA */}
          <div className="absolute bottom-44 left-[10%] z-10 font-bold tracking-tight uppercase">
            <WigglyText
              text="DAFFA"
              className="text-[9rem] font-black"
              delay={NAME_DAFFA_DELAY_MS / 1000}
              stagger={NAME_STAGGER_MS / 1000}
              y={40}
              duration={NAME_DURATION_MS / 1000}
            />
          </div>

          {/* ALTHAF */}
          <div className="absolute right-[8%] bottom-5 z-30 font-bold tracking-tight uppercase">
            <WigglyText
              text="ALTHAF"
              className="text-[9rem] font-black"
              delay={NAME_ALTHAF_DELAY_MS / 1000}
              stagger={NAME_STAGGER_MS / 1000}
              y={40}
              duration={NAME_DURATION_MS / 1000}
            />
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: PORTRAIT_DURATION_MS / 1000,
              delay: PORTRAIT_DELAY_MS / 1000,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute -bottom-58 left-1/2 z-20 -translate-x-1/2 transform"
          >
            <Image
              src="/images/self-hero-123.png"
              alt="Portrait"
              width={600}
              height={600}
              className="object-cover"
            />
          </motion.div>

          {/* Specialties */}
          <div className="absolute bottom-4 left-[2%] z-30 flex flex-col italic">
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
                      x: isActive ? 32 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center gap-4"
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
                      className="text-lg font-medium"
                    >
                      ({String(index + 1).padStart(2, "0")})
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
                      className="text-3xl font-medium"
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

      {/* Icons */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: DESCRIPTION_END_S + 0.2,
        }}
        className="mt-10 flex items-stretch justify-end"
      >
        <div className="border-foreground hidden size-22 items-center justify-center border sm:flex">
          <LayoutGrid className="size-8" />
        </div>

        <div className="bg-foreground text-background hidden size-22 items-center justify-center sm:flex">
          <Sparkles className="size-8" />
        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: DESCRIPTION_END_S + 0.3,
          duration: 0.8,
        }}
        className="border-foreground relative aspect-video w-full border p-8"
      >
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop"
            alt="Recent work showreel"
            fill
            priority
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}

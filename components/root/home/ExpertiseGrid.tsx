"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Code2,
  Smartphone,
  Brain,
  Wifi,
  CircuitBoard,
  type LucideIcon,
  Stars,
} from "lucide-react";
import { Service } from "@/generated/prisma";
import { HoverShadowBox } from "@/components/root/HoverShadowBox";

const ICONS: Record<string, LucideIcon> = {
  "web-development": Code2,
  "app-development": Smartphone,
  "ai-machine-learning": Brain,
  "iot-hardware": Wifi,
  "electronics-engineering": CircuitBoard,
};

export default function ExpertiseGrid({ services }: { services: Service[] }) {
  return (
    <section className="px-gutter py-24">
      <div className="grid grid-cols-4 justify-between sm:flex-row sm:items-start">
        <div className="col-span-2 px-6">
          <h2 className="text-section leading-[0.9] font-bold tracking-tight uppercase">
            Expertise
          </h2>
          <p className="mt-4 text-2xl font-medium">
            I craft websites, apps, AI features and connected hardware that
            spark a moment of joy.
          </p>
        </div>
        <div className=""></div>
        <HoverShadowBox delay={1.9} className="h-fit w-full shrink-0">
          <Link
            href="/work"
            className="border-foreground bg-background relative flex translate-x-0 translate-y-0 items-center justify-between gap-3 border px-4 py-8 font-medium tracking-wide uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
          >
            <span className="flex items-center gap-3">
              <ArrowRight className="size-4 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
              View my skills
            </span>

            <Stars className="size-6 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" />
          </Link>
        </HoverShadowBox>
      </div>

      {/* Staggered icon strip */}
      <ul className="border-foreground mt-32 grid grid-cols-1 border-t sm:grid-cols-2 lg:flex lg:flex-row lg:items-start lg:border-t-0">
        {services.slice(0, 4).map((service, i) => {
          const Icon = ICONS[service.slug] ?? Code2;
          const offset = ["lg:mt-0", "lg:mt-16", "lg:mt-4", "lg:-mt-8"][i];
          const staggerRank = [3, 2, 0, 1][i];

          return (
            <motion.li
              key={service.id}
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.4,
                delay: staggerRank * 0.12,
                ease: "easeOut",
              }}
              className={`border-foreground overflow-hidden border-b sm:border-r lg:flex-1 lg:border ${offset}`}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full min-h-56 p-1.5 transition-colors duration-400 lg:h-120"
              >
                <div className="group-hover:bg-foreground group-hover:text-background flex h-full w-full flex-col justify-between rounded-lg p-6 transition-colors duration-400 ease-out">
                  <div className="flex -translate-x-18 items-center gap-4 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowRight className="size-12" />
                    <Icon
                      className="size-12 transition-transform"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div>
                    <p className="text-3xl font-medium">{service.title}</p>
                    <p className="text-background/70 max-h-0 overflow-hidden text-lg opacity-0 transition-all duration-400 group-hover:mt-3 group-hover:max-h-32 group-hover:opacity-100">
                      {service.summary}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

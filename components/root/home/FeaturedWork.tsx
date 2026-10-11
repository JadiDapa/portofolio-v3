"use client";

import { useOpenCategory } from "@/hooks/use-open-category";
import { motion } from "motion/react";
import { Asterisk, Lightbulb, Sparkles } from "lucide-react";
import ProjectPreview, { type WorkProject } from "@/components/root/work/ProjectPreview";
import ServiceLink from "@/components/root/services/detail/ServiceLink";

/**
 * Three-up masonry: a wide card, then a square card on each side, offset by
 * one column so they interlock. Cards are the same ones /work previews with.
 */
export default function FeaturedWork({ projects }: { projects: WorkProject[] }) {
  const openCategory = useOpenCategory();
  if (projects.length === 0) return null;

  const [first, left, right] = projects;

  const card = (project: WorkProject, landscape?: boolean) => (
    <ProjectPreview
      project={project}
      onCategory={openCategory}
      sticky={false}
      catsStart
      landscape={landscape}
    />
  );

  return (
    <section
      className="px-gutter pt-[calc(var(--gutter-pad)+var(--space-2xl-3xl))] pb-[calc(var(--gutter-pad)+var(--space-2xl-3xl))]"
      data-sec="featured"
    >
      <div className="hm-feat">
        <div className="hm-feat-tiles">
          <div className="sv-tile sv-tile--dark flex">
            <Asterisk strokeWidth={2.2} aria-hidden />
          </div>
          <div className="sv-tile wk-b flex">
            <Lightbulb strokeWidth={1.3} aria-hidden />
          </div>
        </div>
        <div className="hm-feat-1">{card(first, true)}</div>

        {right && (
          <div className="hm-feat-3">
            <div className="hm-feat-tiles hm-feat-tiles--card">
              <div className="sv-tile sv-tile--dark flex">
                <Asterisk strokeWidth={2.2} aria-hidden />
              </div>
              <div className="sv-tile wk-b flex">
                <Lightbulb strokeWidth={1.3} aria-hidden />
              </div>
            </div>
            {card(right)}
          </div>
        )}

        {left && <div className="hm-feat-2">{card(left)}</div>}

        <div className="hm-feat-btn">
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          >
            <ServiceLink href="/work" label="View work" Icon={Sparkles} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

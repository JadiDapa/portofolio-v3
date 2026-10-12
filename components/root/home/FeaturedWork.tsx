"use client";

import { useOpenCategory } from "@/hooks/use-open-category";
import { motion } from "motion/react";
import { Asterisk, Lightbulb, Sparkles } from "lucide-react";
import ProjectPreview, { type WorkProject } from "@/components/root/work/ProjectPreview";
import ServiceLink from "@/components/root/services/detail/ServiceLink";
import InView from "@/components/root/shared/InView";

/**
 * Three-up masonry: a wide card, then a square card on each side, offset by
 * one column so they interlock. More than three projects repeat the pattern,
 * one group per three. Cards are the same ones /work previews with.
 */
export default function FeaturedWork({ projects }: { projects: WorkProject[] }) {
  if (projects.length === 0) return null;

  const groups: WorkProject[][] = [];
  for (let i = 0; i < projects.length; i += 3) groups.push(projects.slice(i, i + 3));

  return (
    <section
      className="px-gutter pt-[calc(var(--gutter-pad)+var(--space-2xl-3xl))] pb-[calc(var(--gutter-pad)+var(--space-2xl-3xl))]"
      data-sec="featured"
    >
      <div className="flex flex-col gap-(--space-2xl-3xl)">
        {groups.map((group, i) => (
          <FeaturedGroup
            key={group[0].id}
            projects={group}
            first={i === 0}
            last={i === groups.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

/** One masonry block. The icon tiles open the section; the "View work" link closes it. */
function FeaturedGroup({
  projects,
  first: isFirst,
  last,
}: {
  projects: WorkProject[];
  first: boolean;
  last: boolean;
}) {
  const openCategory = useOpenCategory();
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

  const tiles = (
    <>
      <div className="sv-tile sv-tile--dark flex">
        <Asterisk strokeWidth={2.2} aria-hidden />
      </div>
      <div className="sv-tile wk-b flex">
        <Lightbulb strokeWidth={1.3} aria-hidden />
      </div>
    </>
  );

  return (
    <div className="hm-feat">
      {isFirst && (
        <InView className="hm-feat-tiles hm-pop" threshold={0.5}>
          {tiles}
        </InView>
      )}
      <InView className="hm-feat-1 hm-rv" threshold={0} rootMargin="0px 0px -12% 0px">
        {card(first, true)}
      </InView>

      {right && (
        <InView className="hm-feat-3 hm-rv hm-pop" threshold={0} rootMargin="0px 0px -12% 0px">
          {isFirst && <div className="hm-feat-tiles hm-feat-tiles--card">{tiles}</div>}
          {card(right)}
        </InView>
      )}

      {left && (
        <InView className="hm-feat-2 hm-rv" threshold={0} rootMargin="0px 0px -12% 0px">
          {card(left)}
        </InView>
      )}

      {last && (
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
      )}
    </div>
  );
}

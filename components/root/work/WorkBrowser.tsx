"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import GridButton from "./GridButton";
import { ARROW_PATH } from "@/components/root/services/detail/ServiceLink";
import { pad2 } from "@/lib/format";
import ProjectPreview, { type WorkProject } from "./ProjectPreview";

const ALL = "All";

export default function WorkBrowser({
  projects,
  initialCategory,
}: {
  projects: WorkProject[];
  initialCategory?: string;
}) {
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [
      { name: ALL, count: projects.length },
      ...[...counts].map(([name, count]) => ({ name, count })),
    ];
  }, [projects]);

  const [category, setCategory] = useState(
    tabs.some((t) => t.name === initialCategory) ? initialCategory! : ALL,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovering, setHovering] = useState(false);

  const items = useMemo(
    () => (category === ALL ? projects : projects.filter((p) => p.category === category)),
    [projects, category],
  );

  const selectCategory = (name: string) => {
    setCategory(name);
    setActiveIndex(0);
    setCycle((c) => c + 1);
  };

  if (projects.length === 0) {
    return (
      <p className="wk-opening py-(--space-xl-2xl) text-center">
        No projects published yet.
      </p>
    );
  }

  const active = items[Math.min(activeIndex, items.length - 1)];

  return (
    <section>
      <nav
        aria-label="Project categories"
        className="wk-tabs flex max-w-full overflow-x-auto"
      >
        {tabs.map((tab, i) => (
          <div
            key={tab.name}
            data-cmp="tab"
            className="wk-tab shrink-0"
            style={{ zIndex: tabs.length - i }}
          >
            <GridButton
              dark={tab.name === category}
              onClick={() => selectCategory(tab.name)}
            >
              <span className="wk-tab-btn">
                <span className="wk-opening">{tab.name}</span>
                <span className="wk-caption">{pad2(tab.count)}</span>
              </span>
            </GridButton>
          </div>
        ))}
      </nav>

      <div className="wk-grid-area grid grid-cols-2 lg:grid-cols-4">
        <ul
          key={category}
          className="wk-list col-span-2"
          onPointerLeave={() => {
            setHovering(false);
            setCycle((c) => c + 1);
          }}
        >
          {items.map((project, i) => {
            const isActive = i === activeIndex;
            return (
              <li
                key={project.id}
                data-cmp="row"
                className="wk-row"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <GridButton
                  href={`/work/${project.slug}`}
                  expand
                  onPointerEnter={() => {
                    setHovering(true);
                    setActiveIndex(i);
                  }}
                >
                  <AnimatePresence>
                    {isActive && !hovering && (
                      <motion.span
                        key={`${i}-${cycle}`}
                        className="wk-timer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span
                          className="wk-timer-bar"
                          onAnimationEnd={() => {
                            setActiveIndex((n) => (n + 1) % items.length);
                            setCycle((c) => c + 1);
                          }}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <svg
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMin meet"
                    className="wk-ico"
                  >
                    <path
                      d={ARROW_PATH}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </svg>
                  <span data-cmp="rowTitle" className="wk-title">{project.title}</span>
                </GridButton>
              </li>
            );
          })}
        </ul>

        <div className="col-span-2">
          {active && (
            <ProjectPreview project={active} onCategory={selectCategory} />
          )}
        </div>
      </div>
    </section>
  );
}

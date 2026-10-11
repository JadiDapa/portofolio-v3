"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { getRelatedProjects } from "@/app/action/project.action";
import GridButton from "../GridButton";
import ProjectPreview, { type WorkProject } from "../ProjectPreview";
import RevealHeading from "../RevealHeading";

/** Two other projects; the reload button swaps them using the same cross-fade as /work. */
export default function RelatedWork({
  projectId,
  initial,
}: {
  projectId: number;
  initial: WorkProject[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [pending, startTransition] = useTransition();

  if (initial.length === 0) return null;

  const reload = () =>
    startTransition(async () => {
      const next = await getRelatedProjects(
        projectId,
        projects.map((p) => p.id),
      );
      if (next.length) setProjects(next);
    });

  const openCategory = (category: string) =>
    router.push(`/work?category=${encodeURIComponent(category)}`);

  return (
    <section>
      <div className="wk-grid">
        <div className="wk-b wk-glass col-span-2 p-(--space-s-m) lg:col-span-3">
          <p className="wk-heading">
            <RevealHeading text="Related Work" inView />
          </p>
        </div>
        <div className="wk-related-reload">
          <GridButton icon ariaLabel="Show other projects" onClick={reload}>
            <RefreshCw
              className={pending ? "animate-spin" : undefined}
              strokeWidth={1.5}
            />
          </GridButton>
        </div>
      </div>

      <div className="wk-grid">
        {projects.map((project, i) => (
          <div key={i} className="relative col-span-2">
            <ProjectPreview
              project={project}
              onCategory={openCategory}
              sticky={false}
              catsStart
            />
          </div>
        ))}
      </div>
    </section>
  );
}

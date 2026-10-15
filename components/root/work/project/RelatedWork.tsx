"use client";

import { useState, useTransition } from "react";
import { useOpenCategory } from "@/hooks/use-open-category";
import { RefreshCw } from "lucide-react";
import { getRelatedProjects } from "@/app/action/project.action";
import GridButton from "../GridButton";
import ProjectPreview, { type WorkProject } from "../ProjectPreview";
import RevealHeading from "@/components/root/shared/RevealHeading";
import { cn } from "@/lib/utils";

/**
 * The hand-picked projects (up to three), topped up to two with random ones when fewer
 * were picked. The reload button only appears while there's a random slot, and only
 * swaps that slot, using the same cross-fade as /work.
 */
export default function RelatedWork({
  projectId,
  picked,
  initial,
}: {
  projectId: number;
  picked: WorkProject[];
  /** Random fill. */
  initial: WorkProject[];
}) {
  const openCategory = useOpenCategory();
  const [random, setRandom] = useState(initial);
  const [pending, startTransition] = useTransition();

  const projects = [...picked, ...random];
  if (projects.length === 0) return null;

  const pickedIds = picked.map((p) => p.id);
  const canReload = initial.length > 0;
  const three = projects.length === 3;

  const reload = () =>
    startTransition(async () => {
      const next = await getRelatedProjects(
        projectId,
        pickedIds,
        random.map((p) => p.id),
      );
      if (next.length) setRandom(next);
    });


  return (
    <section>
      <div className="wk-grid">
        <div
          className={cn(
            "wk-b wk-glass col-span-2 p-(--space-s-m)",
            canReload ? "lg:col-span-3" : "lg:col-span-4",
          )}
        >
          <p className="wk-heading">
            <RevealHeading text="Related Work" inView />
          </p>
        </div>
        {canReload && (
          <div className="wk-related-reload">
            <GridButton icon ariaLabel="Show other projects" onClick={reload}>
              <RefreshCw
                className={pending ? "animate-spin" : undefined}
                strokeWidth={1.5}
              />
            </GridButton>
          </div>
        )}
      </div>

      <div className={cn("wk-grid", three && "wk-grid--3")}>
        {projects.map((project, i) => (
          <div key={i} className={cn("relative col-span-2", three && "lg:col-span-1")}>
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

"use client";

import { useState } from "react";
import { useOpenCategory } from "@/hooks/use-open-category";
import { RefreshCw } from "lucide-react";
import GridButton from "@/components/root/work/GridButton";
import ProjectPreview, { type WorkProject } from "@/components/root/work/ProjectPreview";
import RevealHeading from "@/components/root/shared/RevealHeading";

/** Two projects at a time from `pool`; the reload button pages through it. */
export default function ServiceRelated({ pool }: { pool: WorkProject[] }) {
  const openCategory = useOpenCategory();
  const [start, setStart] = useState(0);

  if (pool.length === 0) return null;

  const shown = [0, 1]
    .map((n) => pool[(start + n) % pool.length])
    .filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i);


  return (
    <section>
      <div className="wk-grid">
        <div className="wk-b wk-glass col-span-2 p-(--space-s-m) lg:col-span-3">
          <p className="wk-heading">
            <RevealHeading text="Related Work" inView />
          </p>
        </div>
        <div className="wk-related-reload">
          <GridButton
            icon
            ariaLabel="Show other projects"
            onClick={() => setStart((s) => (s + 2) % pool.length)}
          >
            <RefreshCw strokeWidth={1.5} />
          </GridButton>
        </div>
      </div>

      <div className="wk-grid">
        {shown.map((project, i) => (
          <div key={i} className="relative col-span-2">
            <ProjectPreview
              project={project}
              onCategory={openCategory}
              sticky={false}
              catsStart
              landscape
            />
          </div>
        ))}
      </div>
    </section>
  );
}

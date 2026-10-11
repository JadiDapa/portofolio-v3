"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import GridButton from "./GridButton";

export type WorkProject = {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage: string | null;
};

function Article({
  project,
  leaving,
  onCategory,
  catsStart,
  landscape,
}: {
  project: WorkProject;
  leaving?: boolean;
  onCategory: (category: string) => void;
  catsStart?: boolean;
  landscape?: boolean;
}) {
  const href = `/work/${project.slug}`;

  return (
    <article
      className={cn(
        "wk-pv",
        leaving ? "wk-pv--leave" : "wk-pv--enter",
        landscape && "wk-pv--land",
      )}
    >
      <Link
        href={href}
        aria-label={project.title}
        tabIndex={leaving ? -1 : undefined}
        className="wk-route wk-b wk-inset"
        data-cmp={leaving ? undefined : "media"}
      >
        <div className="wk-inset-media">
          <div className="wk-inset-this">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[#0f0f0f] text-white">
                {project.title}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="wk-pv_content">
        <Link
          href={href}
          tabIndex={leaving ? -1 : undefined}
          className="wk-route wk-b wk-glass wk-inset"
          data-cmp={leaving ? undefined : "pvTitle"}
        >
          <div className="wk-inset-area">
            <p
              data-cmp={leaving ? undefined : "pvTitleText"}
              className="p-(--space-s-m) text-(length:--step-3) leading-[1.3em] font-semibold tracking-[-0.02em]">
              {project.title}
            </p>
          </div>
        </Link>

        <ul className={cn("wk-cats", catsStart && "wk-cats--start")}>
          <li data-cmp={leaving ? undefined : "pvCat"}>
            <GridButton onClick={() => onCategory(project.category)}>
              <span>{project.category}</span>
            </GridButton>
          </li>
        </ul>
      </div>
    </article>
  );
}

/**
 * Keeps the previous article mounted (absolutely positioned) while the new one
 * fades in on top of it, then drops it once its content has faded out.
 */
export default function ProjectPreview({
  project,
  onCategory,
  sticky = true,
  catsStart,
  landscape,
}: {
  project: WorkProject;
  onCategory: (category: string) => void;
  sticky?: boolean;
  /** Left-align the category buttons under the title (default is right-aligned). */
  catsStart?: boolean;
  /** Always show the cover at 16:9 instead of switching to a square below 96rem. */
  landscape?: boolean;
}) {
  const [shown, setShown] = useState(project);
  const [leaving, setLeaving] = useState<WorkProject | null>(null);

  if (project.id !== shown.id) {
    setLeaving(shown);
    setShown(project);
  }

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), 700);
    return () => clearTimeout(t);
  }, [leaving]);

  return (
    <div className={sticky ? "wk-preview" : "relative"}>
      {leaving && (
        <Article key={`out-${leaving.id}`} project={leaving} leaving onCategory={onCategory} catsStart={catsStart} landscape={landscape} />
      )}
      <Article key={`in-${shown.id}`} project={shown} onCategory={onCategory} catsStart={catsStart} landscape={landscape} />
    </div>
  );
}

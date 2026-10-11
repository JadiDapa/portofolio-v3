"use client";

import { useDeferredValue } from "react";
import ProjectHero from "@/components/root/work/project/ProjectHero";
import ProjectIntro from "@/components/root/work/project/ProjectIntro";
import ProjectGallery from "@/components/root/work/project/ProjectGallery";
import {
  FeaturesSection,
  ResultsSection,
  TextSection,
  ToolsSection,
} from "@/components/root/work/project/ProjectSections";
import { cleanSections, type Section } from "@/servers/validators/project.validator";
import LivePreview from "@/components/dashboard/ui/LivePreview";

export type ProjectPreviewValues = {
  title?: string;
  category?: string;
  summary?: string;
  content?: string | null;
  websiteUrl?: string | null;
  coverImage?: string | null;
  heroVideo?: string | null;
  sections?: Section[];
};

/** The real /work/[slug] sections, fed from the form while you type. */
export default function ProjectLivePreview({ values }: { values: ProjectPreviewValues }) {
  const v = useDeferredValue(values);
  const sections = cleanSections(v.sections);

  return (
    <LivePreview label={`/work/${(v.title || "untitled").toLowerCase().replace(/\s+/g, "-")}`}>
      <article className="px-gutter pb-(--space-xl-2xl) pt-(--space-l-xl)">
        <div className="space-y-(--space-xl-2xl)">
          {sections.map((section) => {
            switch (section.type) {
              case "hero":
                return (
                  <ProjectHero
                    key={section.id}
                    title={v.title || "Untitled"}
                    coverImage={v.coverImage || null}
                    heroVideo={v.heroVideo || null}
                  />
                );
              case "intro":
                return (
                  <ProjectIntro
                    key={section.id}
                    title={v.title || "Untitled"}
                    category={v.category || "Category"}
                    summary={v.summary || ""}
                    content={v.content || null}
                    websiteUrl={v.websiteUrl || null}
                  />
                );
              case "gallery":
                return <ProjectGallery key={section.id} blocks={section.blocks} />;
              case "features":
                return <FeaturesSection key={section.id} section={section} />;
              case "tools":
                return <ToolsSection key={section.id} section={section} />;
              case "results":
                return <ResultsSection key={section.id} section={section} />;
              case "text":
                return <TextSection key={section.id} section={section} />;
            }
          })}
        </div>
      </article>
    </LivePreview>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectService } from "@/servers/services/project.service";
import ProjectHero from "@/components/root/work/project/ProjectHero";
import ProjectIntro from "@/components/root/work/project/ProjectIntro";
import ProjectGallery from "@/components/root/work/project/ProjectGallery";
import RelatedWork from "@/components/root/work/project/RelatedWork";
import {
  FeaturesSection,
  ResultsSection,
  TextSection,
  ToolsSection,
} from "@/components/root/work/project/ProjectSections";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await ProjectService.getBySlug(slug);
  if (!project || !project.published) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await ProjectService.getBySlug(slug);

  if (!project || !project.published) notFound();

  const related = await ProjectService.getRelated([project.id], 2);

  return (
    <article className="px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-xl-2xl)">
        {project.sections.map((section) => {
          switch (section.type) {
            case "hero":
              return (
                <ProjectHero
                  key={section.id}
                  title={project.title}
                  coverImage={project.coverImage}
                  heroVideo={project.heroVideo}
                />
              );
            case "intro":
              return (
                <ProjectIntro
                  key={section.id}
                  title={project.title}
                  category={project.category}
                  summary={project.summary}
                  content={project.content}
                  websiteUrl={project.websiteUrl || null}
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
        <RelatedWork projectId={project.id} initial={related} />
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { ProjectService } from "@/servers/services/project.service";
import { ServiceService } from "@/servers/services/service.service";
import WorkTitle from "@/components/root/work/WorkTitle";
import WorkBrowser from "@/components/root/work/WorkBrowser";
import WorkExpertise from "@/components/root/work/WorkExpertise";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description: "Selected client work and personal builds across software, hardware and AI.",
};

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const [projects, services] = await Promise.all([
    ProjectService.listCards({ take: 100 }),
    ServiceService.getAll(),
  ]);

  return (
    <article className="px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-xl-2xl)">
        <WorkTitle />
        <WorkBrowser
          projects={projects}
          initialCategory={typeof category === "string" ? category : undefined}
        />
        <WorkExpertise services={services} />
      </div>
    </article>
  );
}

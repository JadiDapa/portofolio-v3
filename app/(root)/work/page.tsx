import { ProjectService } from "@/servers/services/project.service";
import { ServiceService } from "@/servers/services/service.service";
import WorkTitle from "@/components/root/work/WorkTitle";
import WorkBrowser from "@/components/root/work/WorkBrowser";
import WorkExpertise from "@/components/root/work/WorkExpertise";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const [{ items }, services] = await Promise.all([
    ProjectService.list({ published: true, pageSize: 100 }),
    ServiceService.getAll(),
  ]);

  const projects = items.map(({ id, title, slug, category, coverImage }) => ({
    id,
    title,
    slug,
    category,
    coverImage,
  }));

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

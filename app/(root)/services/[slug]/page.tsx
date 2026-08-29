import { ServiceService } from "@/servers/services/service.service";
import { ProjectService } from "@/servers/services/project.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectCard from "@/components/root/ProjectCard";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await ServiceService.getBySlug(slug);

  if (!service) notFound();

  const { items: relatedProjects } = await ProjectService.list({
    published: true,
    category: service.title,
    pageSize: 3,
  });

  return (
    <div className="px-gutter py-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/services"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← All services
        </Link>

        <h1 className="text-section mt-6 font-semibold tracking-tight">
          {service.title}
        </h1>
        <p className="text-muted-foreground text-lg mt-4">
          {service.summary}
        </p>

        {service.description && (
          <div
            className="prose prose-neutral dark:prose-invert mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        )}

        <div className="mt-10">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground text-sm inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium transition hover:opacity-90"
          >
            Start a project
          </Link>
        </div>
      </div>

      {relatedProjects.length > 0 && (
        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="text-3xl font-semibold tracking-tight">Related work</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

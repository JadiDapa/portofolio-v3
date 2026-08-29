import { ProjectService } from "@/servers/services/project.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await ProjectService.getBySlug(slug);

  if (!project || !project.published) notFound();

  return (
    <div className="px-gutter py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/work"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← All projects
        </Link>

        <article className="mt-8">
          <header className="mb-8 space-y-3 border-b pb-8">
            <p className="text-primary text-sm font-medium">
              {project.category}
            </p>
            <h1 className="text-section font-semibold tracking-tight">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {[project.client, project.year].filter(Boolean).join(" · ")}
            </p>
          </header>

          {project.coverImage && (
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="text-lg leading-relaxed">{project.summary}</p>

          {project.content && (
            <div
              className="prose prose-neutral dark:prose-invert mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          )}
        </article>
      </div>
    </div>
  );
}

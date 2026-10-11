import { getCurrentUser } from "@/lib/auth";
import { ProjectService } from "@/servers/services/project.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import { ServiceService } from "@/servers/services/service.service";
import { notFound, redirect } from "next/navigation";

export default async function UpdateProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const project = await ProjectService.getBySlug(slug);

  if (!project) notFound();

  const categories = (await ServiceService.getAll()).map((s) => s.title);

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader eyebrow="Work" title="Edit project" subtitle="Write on the left, watch the page on the right." />
      </div>

      <ProjectForm project={project} categories={categories} />
    </main>
  );
}

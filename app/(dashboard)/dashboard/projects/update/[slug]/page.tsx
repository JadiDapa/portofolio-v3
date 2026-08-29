import { getCurrentUser } from "@/app/action/user.action";
import { ProjectService } from "@/servers/services/project.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import UpdateProjectForm from "@/components/dashboard/projects/UpdateProjectForm";
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

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="Update Project" subtitle="Edit this portfolio project." />
      </div>

      <UpdateProjectForm project={project} />
    </main>
  );
}

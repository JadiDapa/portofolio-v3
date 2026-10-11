import { getCurrentUser } from "@/lib/auth";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import ProjectForm from "@/components/dashboard/projects/ProjectForm";
import { ServiceService } from "@/servers/services/service.service";
import { redirect } from "next/navigation";

export default async function CreateProjectPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const categories = (await ServiceService.getAll()).map((s) => s.title);

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader eyebrow="Work" title="New project" subtitle="Write on the left, watch the page on the right." />
      </div>

      <ProjectForm categories={categories} />
    </main>
  );
}

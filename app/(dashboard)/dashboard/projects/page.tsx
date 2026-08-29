import { getCurrentUser } from "@/app/action/user.action";
import PageHeader from "@/components/dashboard/PageHeader";
import ProjectTable from "@/components/dashboard/projects/ProjectTable";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/servers/services/project.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const projects = await ProjectService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Work" subtitle="Manage your portfolio projects." />
        <Button asChild>
          <Link href="/dashboard/projects/create">
            <Plus className="size-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <ProjectTable projects={projects} />

        {projects.length === 0 && (
          <p className="text-muted-foreground py-16 text-center text-sm">
            No projects yet.{" "}
            <Link
              href="/dashboard/projects/create"
              className="text-foreground underline underline-offset-4"
            >
              Add your first project →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

import { getCurrentUser } from "@/lib/auth";
import PageHeader from "@/components/dashboard/PageHeader";
import ProjectTable from "@/components/dashboard/projects/ProjectTable";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import GridButton from "@/components/root/work/GridButton";
import { ProjectService } from "@/servers/services/project.service";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await ProjectService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(02) Portfolio"
        title="Work"
        subtitle="Every project on the public site, live or draft."
        actions={<GridButton href="/dashboard/projects/create">New project</GridButton>}
      />

      {items.length === 0 ? (
        <DbEmpty
          title="Nothing *shipped* yet"
          text="No projects yet. Add the first case study."
          href="/dashboard/projects/create"
          cta="New project"
        />
      ) : (
        <ProjectTable projects={items} />
      )}
    </main>
  );
}

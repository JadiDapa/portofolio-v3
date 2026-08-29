import { ProjectService } from "@/servers/services/project.service";
import ProjectCard from "@/components/root/ProjectCard";

export default async function WorkPage() {
  const { items: projects } = await ProjectService.list({
    published: true,
    pageSize: 100,
  });

  return (
    <div className="px-gutter py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-section font-semibold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground text-lg mt-2">
          A selection of client work and personal builds — spanning web,
          app, AI and hardware.
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground mt-10 text-center">
          No projects published yet.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

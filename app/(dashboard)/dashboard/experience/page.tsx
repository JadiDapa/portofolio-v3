import { getCurrentUser } from "@/app/action/user.action";
import { ExperienceService } from "@/servers/services/experience.service";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateExperienceDialog from "@/components/dashboard/experience/CreateExperienceDialog";
import ExperienceCard from "@/components/dashboard/experience/ExperienceCard";
import { redirect } from "next/navigation";

export default async function ExperiencePage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const experience = await ExperienceService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Experience"
          subtitle="Manage your work and education timeline."
        />
        <CreateExperienceDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experience.map((e) => (
          <ExperienceCard key={e.id} experience={e} />
        ))}
      </div>

      {experience.length === 0 && (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No experience entries yet.
        </p>
      )}
    </main>
  );
}

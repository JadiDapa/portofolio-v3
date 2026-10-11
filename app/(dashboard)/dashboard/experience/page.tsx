import { getCurrentUser } from "@/lib/auth";
import { ExperienceService } from "@/servers/services/experience.service";
import PageHeader from "@/components/dashboard/PageHeader";
import ExperienceSheet from "@/components/dashboard/experience/ExperienceSheet";
import ExperienceCard from "@/components/dashboard/experience/ExperienceCard";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import { redirect } from "next/navigation";

const GROUPS = [
  { type: "WORK", label: "Work" },
  { type: "ORGANIZATION", label: "Organizations" },
  { type: "EDUCATION", label: "Education" },
] as const;

export default async function ExperiencePage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await ExperienceService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(05) Timeline"
        title="Experience"
        subtitle="Work, organizations and education, as shown on the About page."
        actions={<ExperienceSheet />}
      />

      {items.length === 0 ? (
        <DbEmpty title="No *history* yet" text="Add your first role or school." />
      ) : (
        <div className="space-y-(--space-m-l)">
          {GROUPS.map(({ type, label }, g) => {
            const rows = items.filter((e) => e.type === type);
            if (rows.length === 0) return null;
            return (
              <section key={type} className="space-y-3">
                <p className="wk-label">
                  ({String(g + 1).padStart(2, "0")}) {label}{" "}
                  <span className="text-[#b3b3b3]">/ {rows.length}</span>
                </p>
                <div className="db-tl">
                  {rows.map((e, i) => (
                    <ExperienceCard key={e.id} experience={e} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

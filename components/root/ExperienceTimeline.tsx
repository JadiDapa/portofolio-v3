import { Experience } from "@/generated/prisma";
import { Briefcase, GraduationCap } from "lucide-react";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function ExperienceTimeline({
  experience,
}: {
  experience: Experience[];
}) {
  if (experience.length === 0) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {experience.map((item) => {
        const Icon = item.type === "EDUCATION" ? GraduationCap : Briefcase;

        return (
          <div key={item.id} className="flex gap-4">
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-5" />
            </div>
            <div className="border-border flex-1 border-b pb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">{item.role}</h3>
                <span className="text-muted-foreground text-xs">
                  {formatDate(item.startDate)} —{" "}
                  {item.endDate ? formatDate(item.endDate) : "Present"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {item.organization}
              </p>
              {item.description && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

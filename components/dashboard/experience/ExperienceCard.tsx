import { Experience } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EditExperienceDialog from "./EditExperienceDialog";

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {experience.type.toLowerCase()}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatDate(experience.startDate)} —{" "}
              {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </span>
          </div>
          <p className="text-foreground mt-2 font-medium">{experience.role}</p>
          <p className="text-muted-foreground text-sm">
            {experience.organization}
          </p>
        </div>
        <EditExperienceDialog experience={experience} />
      </CardContent>
    </Card>
  );
}

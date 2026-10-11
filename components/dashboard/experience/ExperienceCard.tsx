import { Experience } from "@/generated/prisma";
import ExperienceSheet from "./ExperienceSheet";

const year = (d: Date) => new Date(d).getFullYear();
const month = (d: Date) =>
  new Date(d)
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toUpperCase();

/** One dated row of the timeline. The black wipe origin is set by the parent list. */
export default function ExperienceCard({
  experience,
  index = 0,
}: {
  experience: Experience;
  index?: number;
}) {
  const current = !experience.endDate;

  return (
    <div className="db-tl_row" style={{ "--i": index } as React.CSSProperties}>
      <div className="db-tl_date">
        {year(experience.startDate)} — {current ? "Now" : year(experience.endDate!)}
        <small>
          {month(experience.startDate)} →{" "}
          {current ? "PRESENT" : month(experience.endDate!)}
        </small>
      </div>

      <div className="min-w-0">
        <p className="db-tl_role">{experience.role}</p>
        <p className="db-cell-sub mt-1">{experience.organization}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="db-chip">{experience.type.toLowerCase()}</span>
          {experience.highlights.length > 0 && (
            <span className="db-cell-sub">
              {experience.highlights.length} highlight
              {experience.highlights.length === 1 ? "" : "s"}
            </span>
          )}
          {experience.tools.slice(0, 4).map((t) => (
            <span key={t} className="db-cell-sub">
              · {t}
            </span>
          ))}
          {experience.tools.length > 4 && (
            <span className="db-cell-sub">+{experience.tools.length - 4}</span>
          )}
        </div>
      </div>

      <ExperienceSheet experience={experience} />
    </div>
  );
}

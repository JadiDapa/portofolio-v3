import type { ProjectCard } from "@/servers/services/project.service";
import ContactShowcase from "@/components/root/contact/ContactShowcase";

/** Two-row strip of project covers drifting in opposite directions, above the footer. */
export default function MoreWork({ projects }: { projects: ProjectCard[] }) {
  const items = projects
    .filter((p) => p.coverImage)
    .map(({ id, title, coverImage }) => ({ id, title, coverImage: coverImage! }));
  if (items.length === 0) return null;

  return (
    // overflow-x-clip trims the rows that bleed past the frame without clipping the hover lift
    <section className="px-gutter pt-(--gutter-pad) overflow-x-clip" data-sec="more">
      <ContactShowcase items={items} />
    </section>
  );
}

import { GraduationCap } from "lucide-react";
import type { Experience } from "@/generated/prisma";
import AboutTitle from "./AboutTitle";
import Reveal from "./Reveal";

const year = (d: Date) => new Date(d).getUTCFullYear();

/** Degrees, set like diploma cards: big years, outlined degree name, notes on the right. */
export default function AboutEducation({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;
  const now = new Date();

  return (
    <section data-cmp="education">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <AboutTitle
          cmp="eduTitle"
          className="ab-approach-title ab-pad wk-b ab-glass col-span-2 lg:col-span-3"
          boxed={false}
          left="Learned"
          right="Applied"
          heading="Education"
          inView
        />
        <div className="ab-approach-tile col-span-2 flex items-end lg:col-span-1">
          <div className="ab-tile wk-b" aria-hidden>
            <GraduationCap strokeWidth={1.2} />
          </div>
        </div>
      </div>

      <div className="relative z-1">
        {items.map((item) => {
          const ends = item.endDate ? new Date(item.endDate) : null;
          const pending = !ends || ends > now;
          return (
            <Reveal key={item.id} className="ab-edu wk-b ab-glass">
              <div className="ab-edu_main">
                <p className="ab-edu_years">
                  {year(item.startDate)}
                  <span aria-hidden> → </span>
                  {ends ? year(ends) : "Now"}
                </p>
                <p className="wk-label text-[#b3b3b3]">
                  {pending ? "In progress" : "Graduated"}
                </p>
                <h3 className="ab-edu_degree">{item.role}</h3>
                <p className="ab-subtitle">{item.organization}</p>
              </div>
              <div className="ab-edu_side">
                {item.description && <p className="ab-subtext">{item.description}</p>}
                {item.highlights.length > 0 && (
                  <ul className="ab-xp_hl">
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
                {item.tools.length > 0 && (
                  <ul className="ab-xp_tools" aria-label="Tools used">
                    {item.tools.map((t) => (
                      <li key={t} className="sd-tool">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

import { Layers, Sparkles } from "lucide-react";
import type { Service } from "@/generated/prisma";
import GridButton from "@/components/root/work/GridButton";
import ServiceRow from "./ServiceRow";

const ARROW =
  "M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173";

export default function ServicesOverview({ services }: { services: Service[] }) {
  return (
    <section className="wk-grid">
      <div className="col-span-2 lg:col-span-3">
        <div className="flex justify-end">
          <div data-cmp="overviewTile" className="sv-tile wk-b flex">
            <Layers strokeWidth={1} aria-hidden />
          </div>
        </div>

        <ul data-cmp="list" className="sv-list">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </ul>
      </div>

      <div className="sv-aside">
        <div className="sv-aside-sticky">
          <div
            data-cmp="aside"
            className="wk-b space-y-(--space-s-m) bg-[#0f0f0f] p-(--space-s-m) text-white"
          >
            <p data-cmp="asideTitle" className="sv-aside-title text-balance">
              What I <br />
              build <br />
              best
            </p>
            <p data-cmp="asideText" className="wk-type-text">
              Each discipline links to a closer look at how I work, the
              tools I use and the projects it&nbsp;powers.
            </p>
          </div>

          <div data-cmp="asideBtn">
            <GridButton href="/work" expand className="sv-link" ariaLabel="View my work">
              <svg viewBox="0 0 24 24" fill="none" className="sv-link-left" aria-hidden>
                <path
                  d={ARROW}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
              <span className="sv-link-text">View my work</span>
              <Sparkles className="sv-link-right" strokeWidth={1.5} aria-hidden />
            </GridButton>
          </div>
        </div>
      </div>
    </section>
  );
}

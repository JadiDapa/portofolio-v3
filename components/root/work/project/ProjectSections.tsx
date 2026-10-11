import type { Section } from "@/servers/validators/project.validator";
import RevealHeading from "@/components/root/shared/RevealHeading";
import Body from "./Body";

type Of<T extends Section["type"]> = Extract<Section, { type: T }>;

/** Glass heading box in the same style as "Related Work". */
function SectionHeading({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="wk-b wk-glass p-(--space-s-m)">
      <h2 className="wk-heading">
        <RevealHeading text={text} inView />
      </h2>
    </div>
  );
}

/** One or two items take half the row each; three or more fill the four columns. */
const cell = (count: number) =>
  count <= 2 ? "col-span-2" : "col-span-2 lg:col-span-1";

export function FeaturesSection({ section }: { section: Of<"features"> }) {
  return (
    <section>
      <SectionHeading text={section.title || "Features"} />
      <div className="wk-grid">
        {section.items.map((item, i) => (
          <div
            key={i}
            className={`wk-b wk-glass space-y-(--space-2xs-xs) p-(--space-s-m) ${cell(section.items.length)}`}
          >
            <p className="wk-feature-title">{item.title}</p>
            {item.description && (
              <p className="wk-type-text">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ToolsSection({ section }: { section: Of<"tools"> }) {
  return (
    <section>
      <SectionHeading text={section.title || "Tools"} />
      <ul className="flex flex-wrap">
        {section.items.map((tool, i) => (
          <li
            key={i}
            className="wk-b wk-glass wk-opening flex h-[calc(var(--space-m)*2.666)] items-center px-(--space-m-l)"
          >
            {tool}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ResultsSection({ section }: { section: Of<"results"> }) {
  return (
    <section>
      <SectionHeading text={section.title || "Results"} />
      <div className="wk-grid">
        {section.items.map((item, i) => (
          <div
            key={i}
            className={`wk-b wk-glass flex flex-col justify-between gap-(--space-m-l) p-(--space-s-m) ${cell(section.items.length)}`}
          >
            <p className="wk-metric">{item.value}</p>
            <p className="wk-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TextSection({ section }: { section: Of<"text"> }) {
  return (
    <section>
      <SectionHeading text={section.title} />
      <div className="wk-b wk-glass p-(--space-s-m)">
        <div className="wk-reduced wk-type-text">
          <Body content={section.body} />
        </div>
      </div>
    </section>
  );
}

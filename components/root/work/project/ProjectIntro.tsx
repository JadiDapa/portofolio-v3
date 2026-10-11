import GridButton from "../GridButton";
import ProjectTitle from "./ProjectTitle";
import Body from "./Body";

const ARROW =
  "M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173";

export default function ProjectIntro({
  title,
  category,
  summary,
  content,
  websiteUrl,
}: {
  title: string;
  category: string;
  summary: string;
  content: string | null;
  websiteUrl: string | null;
}) {
  return (
    <header>
      <ul className="flex">
        <li className="relative z-3">
          <GridButton href={`/work?category=${encodeURIComponent(category)}`}>
            <span>{category}</span>
          </GridButton>
        </li>
      </ul>

      <div className="wk-glass">
        <ProjectTitle title={title} />
      </div>

      <div className="wk-grid">
        <div className="wk-b wk-glass col-span-2 p-(--space-s-m)">
          <p className="wk-reduced wk-type-title text-pretty">{summary}</p>
        </div>
        <div className="wk-b wk-glass col-span-2 p-(--space-s-m)">
          {content && (
            <div className="wk-reduced wk-type-text">
              <Body content={content} />
            </div>
          )}
        </div>
      </div>

      {websiteUrl && (
        <div className="wk-grid">
          <div className="col-span-2 lg:col-start-3">
            <GridButton href={websiteUrl} expand ariaLabel="Visit the website">
              <span className="wk-label">Visit the website</span>
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="size-[1.4em] -rotate-45"
                aria-hidden
              >
                <path
                  d={ARROW}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>
            </GridButton>
          </div>
        </div>
      )}
    </header>
  );
}

import { BookOpen } from "lucide-react";
import AboutTitle from "./AboutTitle";
import Reveal from "./Reveal";

const APPROACH = [
  {
    title: "Craft Over Chaos",
    description:
      "Good software is calm software. I favour clear structure, readable code and well-understood tools over whatever is trending this week. The goal is a product that is easy to change long after launch day, so the next feature costs you less than the last one did.",
  },
  {
    title: "Full Stack, Literally",
    description:
      "From the database schema to the screen to the signal on the wire. Knowing how every layer behaves means fewer surprises where they meet, and better decisions when a problem could be solved in more than one place.",
  },
  {
    title: "Stay Curious",
    description:
      "Every project teaches me something new. I read the docs, poke at the edge cases and question my first idea, because the best solution is rarely the obvious one. Curiosity is how a good build becomes a great one, every time.",
  },
  {
    title: "Progress Over Polish",
    description:
      "Ship small, learn fast, refine often. A working version in your hands beats a perfect plan on paper. You always know where things stand, and steady visible progress keeps the whole project on track and honest.",
  },
];

export default function AboutApproach() {
  return (
    <section data-cmp="approach">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <AboutTitle
          cmp="approachTitle"
          className="ab-approach-title ab-pad wk-b ab-glass col-span-2 lg:col-span-3"
          boxed={false}
          left="Mindset"
          right="Method"
          heading="Working Principles"
          inView
        />
        <div className="ab-approach-tile col-span-2 flex items-end lg:col-span-1">
          <div className="ab-tile wk-b" aria-hidden>
            <BookOpen strokeWidth={1.2} />
          </div>
        </div>
      </div>
      <div className="relative z-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {APPROACH.map((item, i) => (
          <Reveal key={item.title} className="ab-space wk-b ab-glass ab-p">
            <p className="wk-label">{String(i + 1).padStart(2, "0")}</p>
            <p className="ab-approach-heading ab-subtitle">{item.title}</p>
            <p className="ab-subtext">{item.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

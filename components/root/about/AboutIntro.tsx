import { Info } from "lucide-react";
import Reveal from "./Reveal";

export default function AboutIntro() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4" data-cmp="intro">
      <div className="col-span-2">
        <Reveal className="ab-intro-heading wk-b ab-glass ab-p">
          <p className="ab-subtitle text-balance">
            I&apos;m Daffa, a software engineer with an electrical background.
            <br />
            <br />I build things for servers, screens and circuit boards.
          </p>
        </Reveal>
      </div>
      <div className="col-span-2 flex items-start">
        <Reveal className="ab-intro-text ab-space wk-b ab-glass ab-p grow">
          <p className="wk-opening text-balance">
            I started out wiring circuits and ended up writing the code that
            drives them. Now I work across the whole stack, right down to the
            hardware that runs it.
          </p>
          <p className="ab-subtext text-balance">
            Working with me is simple: you work directly with the engineer.
            <br />
            <br />
            No hand-offs, no account managers. I take an idea from rough brief
            to real product, explain the trade-offs plainly and keep you in
            the loop all the way. You get to know me, and I get to know
            your users.
            <br />
            <br />
            I care about clean architecture, honest estimates and shipping work
            I&apos;m proud to sign. Small team, short feedback loops, no
            surprises.
          </p>
        </Reveal>
        <div className="ab-tile ab-tile--lg wk-b" aria-hidden>
          <Info strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}

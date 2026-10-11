"use client";

import { useEntered } from "@/hooks/use-entered";
import BoxFrame from "@/components/root/shared/BoxFrame";
import { LabelArt } from "@/components/root/work/WorkArt";
import RevealHeading from "@/components/root/shared/RevealHeading";

const LABEL_LEFT = "Let's talk";
const LABEL_RIGHT = "Build together";
const HEADING = "Contact";
const OPENING = (
  <>
    Have a project in mind?
    <br />
    Send me a message and let&apos;s build it together
  </>
);

export default function ContactTitle() {
  const visible = useEntered();

  return (
    <div className="relative" data-cmp="title">
      <BoxFrame visible={visible} className="ct-glass" />

      <header className="wk-pad relative space-y-(--space-3xs-2xs) text-center">
        <p
          data-cmp="label"
          className="wk-label flex items-center justify-center gap-(--space-3xs-2xs)"
        >
          <span className="hidden basis-[40%] text-right sm:block">{LABEL_LEFT}</span>
          <span className="size-[5em] shrink-0">
            <LabelArt />
          </span>
          <span className="hidden basis-[40%] text-left sm:block">{LABEL_RIGHT}</span>
        </p>

        <div className="space-y-(--space-s-m)">
          <h1 data-cmp="h1" className="ct-subheading text-balance">
            <RevealHeading text={HEADING} />
          </h1>
          <p data-cmp="opening" className="wk-opening mx-auto max-w-195 text-balance">
            {OPENING}
          </p>
        </div>
      </header>
    </div>
  );
}

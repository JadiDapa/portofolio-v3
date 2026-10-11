import Image from "next/image";
import { ArrowRight, Cpu } from "lucide-react";
import GridButton from "@/components/root/work/GridButton";
import Reveal from "./Reveal";

// Swap these for whatever is on the bench right now.
const BUILDING = {
  title: "Workshop Monitor",
  blurb: "ESP32 bench sensors streaming to a live web dashboard.",
  meta: "In progress • Firmware + Next.js",
  href: "/work",
  cover: "/about/building.jpg",
};

export default function AboutBuilding() {
  return (
    <section data-cmp="building">
      <div className="ab-tile wk-b" aria-hidden>
        <Cpu strokeWidth={1.2} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Reveal className="ab-build-cover wk-b">
            <a href={BUILDING.href} aria-label={BUILDING.title}>
              <div className="ab-build-cover_disc">
                <div className="ab-spin">
                  <Image src={BUILDING.cover} alt="" fill sizes="240px" className="object-cover" />
                </div>
              </div>
            </a>
          </Reveal>
        </div>
        <Reveal className="col-span-2 flex flex-col">
          <div className="flex">
            <div className="ab-build-heading wk-b flex h-(--ab-grid) items-center px-(--space-s-m)">
              <p className="ab-shout">Currently building</p>
            </div>
          </div>
          <div className="wk-b ab-glass ab-p flex grow flex-col">
            <p className="ab-subtitle">{BUILDING.title}</p>
            <p className="ab-subtext grow">{BUILDING.blurb}</p>
            <p className="ab-subtext">{BUILDING.meta}</p>
          </div>
        </Reveal>
        <div className="col-span-2 lg:col-span-1">
          <GridButton href={BUILDING.href} expand>
            <span className="wk-label">View the project</span>
            <ArrowRight className="size-[1.4em]" strokeWidth={1} />
          </GridButton>
        </div>
      </div>
    </section>
  );
}

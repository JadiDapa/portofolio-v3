import type { Metadata } from "next";
import { RecognitionService } from "@/servers/services/recognition.service";
import { ServiceService } from "@/servers/services/service.service";
import AboutHero from "@/components/root/about/AboutHero";
import AboutIntro from "@/components/root/about/AboutIntro";
import AboutPortraits from "@/components/root/about/AboutPortraits";
import AboutApproach from "@/components/root/about/AboutApproach";
import AboutRecognition from "@/components/root/about/AboutRecognition";
import AboutBuilding from "@/components/root/about/AboutBuilding";
import WorkExpertise from "@/components/root/work/WorkExpertise";

export const metadata: Metadata = {
  title: "About",
  description:
    "Daffa Althaf Ridovani — software engineer with an electrical engineering background.",
};

export default async function AboutPage() {
  const [recognition, services] = await Promise.all([
    RecognitionService.getPublished(),
    ServiceService.getAll(),
  ]);

  return (
    <article className="px-gutter">
      <div className="space-y-(--space-2xl-3xl)">
        <AboutHero />
        <AboutIntro />
        <AboutPortraits />
        <AboutApproach />
        <AboutRecognition items={recognition} />
        <WorkExpertise
          services={services}
          opening="Software, hardware and AI: technical answers for whatever your product needs."
        />
        <AboutBuilding />
      </div>
    </article>
  );
}

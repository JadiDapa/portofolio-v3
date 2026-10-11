import type { Metadata } from "next";
import { RecognitionService } from "@/servers/services/recognition.service";
import { ExperienceService } from "@/servers/services/experience.service";
import { ServiceService } from "@/servers/services/service.service";
import AboutHero from "@/components/root/about/AboutHero";
import AboutIntro from "@/components/root/about/AboutIntro";
import AboutApproach from "@/components/root/about/AboutApproach";
import AboutRecognition from "@/components/root/about/AboutRecognition";
import AboutBuilding from "@/components/root/about/AboutBuilding";
import AboutExperience from "@/components/root/about/AboutExperience";
import AboutEducation from "@/components/root/about/AboutEducation";
import AboutToolbox from "@/components/root/about/AboutToolbox";
import { SkillSchema, parseList } from "@/servers/validators/service.validator";
import WorkExpertise from "@/components/root/work/WorkExpertise";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Daffa Althaf Ridovani — software engineer with an electrical engineering background.",
};

export default async function AboutPage() {
  const [recognition, services, experience] = await Promise.all([
    RecognitionService.getPublished(),
    ServiceService.getAll(),
    ExperienceService.getGrouped(),
  ]);

  return (
    <article className="px-gutter">
      <div className="space-y-(--space-2xl-3xl)">
        <AboutHero />
        <AboutIntro />
        <AboutApproach />
        <AboutExperience work={experience.work} organization={experience.organization} />
        <AboutEducation items={experience.education} />
        <AboutRecognition items={recognition} />
        <WorkExpertise
          services={services}
          opening="Software, IoT, power and control: technical answers for whatever your product needs."
        />
        <AboutToolbox
          services={services.map((s) => ({
            slug: s.slug,
            title: s.title,
            skills: parseList(SkillSchema, s.skills),
          }))}
        />
        <AboutBuilding />
      </div>
    </article>
  );
}

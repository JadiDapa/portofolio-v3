import Hero from "@/components/root/home/Hero";
import Showreel from "@/components/root/home/Showreel";
import ExpertiseGrid from "@/components/root/home/ExpertiseGrid";
import FeaturedWork from "@/components/root/home/FeaturedWork";
import MoreWork from "@/components/root/home/MoreWork";
import Enquiry from "@/components/root/home/Enquiry";
import Testimonials from "@/components/root/home/Testimonials";
import { ServiceService } from "@/servers/services/service.service";
import { ProjectService } from "@/servers/services/project.service";
import { TestimonialService } from "@/servers/services/testimonial.service";
import { SOCIAL } from "@/components/root/siteLinks";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Software Engineer & Electrical Engineer",
  sameAs: [SOCIAL.github, SOCIAL.linkedin],
};

export default async function HomePage() {
  const [services, featuredProjects, moreProjects, testimonials] = await Promise.all([
    ServiceService.getAll(),
    ProjectService.listCards({ featured: true, take: 6 }),
    ProjectService.listCards({ take: 24 }),
    TestimonialService.getPublished(4),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
      />
      <Hero />
      <Showreel />
      <ExpertiseGrid services={services} />
      <FeaturedWork projects={featuredProjects} />
      <Enquiry />
      <Testimonials testimonials={testimonials} />
      <MoreWork projects={moreProjects} />
    </>
  );
}

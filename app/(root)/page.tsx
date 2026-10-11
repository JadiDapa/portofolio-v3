import Hero from "@/components/root/home/Hero";
import Showreel from "@/components/root/home/Showreel";
import ExpertiseGrid from "@/components/root/home/ExpertiseGrid";
import FeaturedWork from "@/components/root/home/FeaturedWork";
import MoreWork from "@/components/root/home/MoreWork";
import Enquiry from "@/components/root/home/Enquiry";
import Testimonials from "@/components/root/home/Testimonials";
import type { Project } from "@/generated/prisma";
import { ServiceService } from "@/servers/services/service.service";
import { ProjectService } from "@/servers/services/project.service";
import { TestimonialService } from "@/servers/services/testimonial.service";

const toWorkProject = ({ id, title, slug, category, coverImage }: Project) => ({
  id,
  title,
  slug,
  category,
  coverImage,
});

export default async function HomePage() {
  const [
    services,
    { items: featuredProjects },
    { items: moreProjects },
    testimonials,
  ] = await Promise.all([
    ServiceService.getAll(),
    ProjectService.list({ published: true, featured: true, pageSize: 3 }),
    ProjectService.list({ published: true, pageSize: 24 }),
    TestimonialService.getPublished(4),
  ]);

  return (
    <>
      <Hero />
      <Showreel />
      <ExpertiseGrid services={services} />
      <FeaturedWork projects={featuredProjects.map(toWorkProject)} />
      <Enquiry />
      <Testimonials testimonials={testimonials} />
      <MoreWork projects={moreProjects} />
    </>
  );
}

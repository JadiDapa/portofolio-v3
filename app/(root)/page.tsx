import Hero from "@/components/root/home/Hero";
import ExpertiseGrid from "@/components/root/home/ExpertiseGrid";
import FeaturedWork from "@/components/root/home/FeaturedWork";
import MoreWork from "@/components/root/home/MoreWork";
import Enquiry from "@/components/root/home/Enquiry";
import Testimonials from "@/components/root/home/Testimonials";
import { ServiceService } from "@/servers/services/service.service";
import { ProjectService } from "@/servers/services/project.service";
import { TestimonialService } from "@/servers/services/testimonial.service";

export default async function HomePage() {
  const [
    services,
    { items: featuredProjects },
    { items: moreProjects },
    testimonials,
  ] = await Promise.all([
    ServiceService.getAll(),
    ProjectService.list({ published: true, featured: true, pageSize: 3 }),
    ProjectService.list({ published: true, featured: false, pageSize: 9 }),
    TestimonialService.getPublished(4),
  ]);

  return (
    <>
      <Hero />
      <ExpertiseGrid services={services} />
      <FeaturedWork projects={featuredProjects} />
      <MoreWork projects={moreProjects} />
      <Enquiry />
      <Testimonials testimonials={testimonials} />
    </>
  );
}

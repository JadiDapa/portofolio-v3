import { Project } from "@/generated/prisma";
import ProjectCard from "@/components/root/ProjectCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MoreWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="px-gutter py-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2 className="text-section leading-[0.9] font-bold tracking-tight uppercase">
          More Work
        </h2>
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {projects.map((project) => (
            <CarouselItem
              key={project.id}
              className="sm:basis-1/2 lg:basis-1/3"
            >
              <ProjectCard project={project} aspect="landscape" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

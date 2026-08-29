import Link from "next/link";
import { ArrowRight, Stars } from "lucide-react";
import { Project } from "@/generated/prisma";
import ProjectCard from "@/components/root/ProjectCard";
import { HoverShadowBox } from "../HoverShadowBox";

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const leftColumn = projects.filter((_, i) => i % 2 === 0);
  const rightColumn = projects.filter((_, i) => i % 2 === 1);

  return (
    <section className="px-gutter py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col gap-6">
          {leftColumn.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              aspect="landscape"
            />
          ))}
        </div>
        <div className="flex h-full flex-col">
          <div className="col-span-2 mb-32 px-6 text-end">
            <h2 className="text-section leading-[0.9] font-bold tracking-tight uppercase">
              WORKS
            </h2>
            <p className="mt-4 text-2xl font-medium">
              I craft websites, apps, AI features and connected hardware that
              spark a moment of joy.
            </p>
          </div>
          <div className="col-span-2 gap-6">
            {rightColumn.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                aspect="landscape"
              />
            ))}
          </div>
          <HoverShadowBox
            delay={1.9}
            className="mt-auto ml-auto h-fit w-1/2 shrink-0"
          >
            <Link
              href="/work"
              className="border-foreground bg-background relative flex translate-x-0 translate-y-0 items-center justify-between gap-3 border px-4 py-8 font-medium tracking-wide uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
            >
              <span className="flex items-center gap-3">
                <ArrowRight className="size-4 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
                View all works
              </span>

              <Stars className="size-6 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" />
            </Link>
          </HoverShadowBox>
        </div>
      </div>
    </section>
  );
}

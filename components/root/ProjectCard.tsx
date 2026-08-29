import Image from "next/image";
import Link from "next/link";
import { Project } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { HoverShadowBox } from "./HoverShadowBox";

export default function ProjectCard({
  project,
  aspect = "square",
  className,
}: {
  project: Project;
  aspect?: "landscape" | "square" | "portrait";
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col", className)}>
      <Link
        href={`/work/${project.slug}`}
        className={cn(
          "group bg-muted border-foreground relative block overflow-hidden border",
          aspect === "landscape" && "aspect-video",
          aspect === "square" && "aspect-square",
          aspect === "portrait" && "aspect-9/16",
        )}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
            {project.title}
          </div>
        )}
      </Link>

      {/* Title bar */}
      <Link
        href={`/work/${project.slug}`}
        className="border-foreground hover:bg-foreground/2 border-x border-b p-8 transition-colors"
      >
        <h3 className="text-4xl font-medium">{project.title}</h3>
      </Link>

      <HoverShadowBox delay={1.9} className="inline-flex h-fit w-fit shrink-0">
        <Link
          href={`/work?category=${encodeURIComponent(project.category)}`}
          className="border-foreground bg-background relative flex w-fit translate-x-0 translate-y-0 items-center justify-between gap-3 border px-4 py-8 font-medium tracking-wide uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
        >
          {project.category}
        </Link>
      </HoverShadowBox>
    </article>
  );
}

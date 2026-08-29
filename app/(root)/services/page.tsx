import Link from "next/link";
import { ServiceService } from "@/servers/services/service.service";
import ServiceCard from "@/components/root/ServiceCard";

const AT_A_GLANCE = [
  "React & Next.js",
  "Mobile Apps",
  "Machine Learning",
  "Embedded Systems",
  "PCB Design",
  "REST & GraphQL APIs",
  "Cloud Infrastructure",
  "Sensor Integration",
];

export default async function ServicesPage() {
  const services = await ServiceService.getAll();

  return (
    <div>
      <section className="px-gutter py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-section font-semibold tracking-tight">
            What I Can Build For You
          </h1>
          <p className="text-muted-foreground text-lg mt-4">
            A multidisciplinary skill set spanning software and hardware —
            available for freelance and contract work.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            My Electrical Engineering background and software career give
            me a broad toolkit — from web and app development to AI
            features and IoT hardware. I bring all of it to every project,
            which means fewer handoffs and a more complete result.
          </p>
        </div>

        {services.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted/30 border-t">
        <div className="px-gutter py-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Skills at a glance
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Some of the tools and technologies I work with regularly.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {AT_A_GLANCE.map((tag) => (
              <span
                key={tag}
                className="bg-card text-sm rounded-full border px-4 py-2"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/work"
              className="hover:text-muted-foreground text-sm font-medium underline underline-offset-4 transition-colors"
            >
              View my projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

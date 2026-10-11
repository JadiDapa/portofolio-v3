import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceService } from "@/servers/services/service.service";
import { ProjectService } from "@/servers/services/project.service";
import {
  FaqSchema,
  ProcessStepSchema,
  SkillSchema,
  parseList,
} from "@/servers/validators/service.validator";
import ServiceHero from "@/components/root/services/detail/ServiceHero";
import ServiceIntro from "@/components/root/services/detail/ServiceIntro";
import ServiceSkills from "@/components/root/services/detail/ServiceSkills";
import ServiceProcess from "@/components/root/services/detail/ServiceProcess";
import ServiceRelated from "@/components/root/services/detail/ServiceRelated";
import ServiceFaq from "@/components/root/services/detail/ServiceFaq";
import ServiceCta from "@/components/root/services/detail/ServiceCta";
import ServiceSwitcher from "@/components/root/services/detail/ServiceSwitcher";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await ServiceService.getBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [service, services, others] = await Promise.all([
    ServiceService.getBySlug(slug),
    ServiceService.getAll(),
    ProjectService.listCards({ take: 12 }),
  ]);

  if (!service) notFound();

  const own = await ProjectService.listCards({ category: service.title, take: 12 });

  // Projects in this service first, then anything else so the showcase is never empty
  const seen = new Set<number>();
  const projects = [...own, ...others].filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const images = projects.flatMap((p) => (p.coverImage ? [p.coverImage] : []));

  const steps = parseList(ProcessStepSchema, service.process);
  const faqs = parseList(FaqSchema, service.faqs);
  const skills = parseList(SkillSchema, service.skills);

  return (
    <article className="sd-page px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-2xl-3xl)">
        <ServiceHero
          slug={service.slug}
          title={service.title}
          summary={service.summary}
          images={images}
        />
        <ServiceIntro
          headline={service.headline || service.title}
          lead={service.lead || service.summary}
          description={service.description}
        />
        <ServiceSkills skills={skills} title={service.title} />
        <ServiceProcess steps={steps} title={service.title} />
        <ServiceRelated pool={projects} />
        <ServiceFaq faqs={faqs} title={service.title} />
        <div className="-mt-(--space-l-xl)">
          <ServiceCta slug={service.slug} />
        </div>
      </div>

      <ServiceSwitcher services={services} active={service.slug} />
    </article>
  );
}

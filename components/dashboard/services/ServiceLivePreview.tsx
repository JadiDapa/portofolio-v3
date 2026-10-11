"use client";

import { useDeferredValue } from "react";
import ServiceHero from "@/components/root/services/detail/ServiceHero";
import ServiceIntro from "@/components/root/services/detail/ServiceIntro";
import ServiceSkills from "@/components/root/services/detail/ServiceSkills";
import ServiceProcess from "@/components/root/services/detail/ServiceProcess";
import ServiceFaq from "@/components/root/services/detail/ServiceFaq";
import {
  cleanFaqs,
  cleanProcess,
  cleanSkills,
  type Faq,
  type ProcessStep,
  type Skill,
} from "@/servers/validators/service.validator";
import LivePreview from "@/components/dashboard/ui/LivePreview";

export type ServicePreviewValues = {
  title?: string;
  summary?: string;
  description?: string | null;
  headline?: string | null;
  lead?: string | null;
  process?: ProcessStep[];
  faqs?: Faq[];
  skills?: Skill[];
};

const slugOf = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** The real /services/[slug] hero, intro, process and FAQ, fed from the form. */
export default function ServiceLivePreview({ values }: { values: ServicePreviewValues }) {
  const v = useDeferredValue(values);
  const title = v.title || "Untitled service";
  const slug = slugOf(title) || "untitled";

  return (
    <LivePreview label={`/services/${slug}`}>
      <article className="sd-page px-gutter pb-(--space-xl-2xl) pt-(--space-l-xl)">
        <div className="space-y-(--space-2xl-3xl)">
          <ServiceHero slug={slug} title={title} summary={v.summary || ""} images={[]} />
          <ServiceIntro
            headline={v.headline || title}
            lead={v.lead || v.summary || ""}
            description={v.description || null}
          />
          <ServiceSkills skills={cleanSkills(v.skills)} title={title} />
          <ServiceProcess steps={cleanProcess(v.process)} title={title} />
          <ServiceFaq faqs={cleanFaqs(v.faqs)} title={title} />
        </div>
      </article>
    </LivePreview>
  );
}

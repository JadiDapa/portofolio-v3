import { Sparkles } from "lucide-react";
import { Service } from "@/generated/prisma";
import WorkExpertise from "@/components/root/work/WorkExpertise";
import ServiceLink from "@/components/root/services/detail/ServiceLink";

/** Home expertise: the same heading + staggered cards as /work, plus a link to /services. */
export default function ExpertiseGrid({ services }: { services: Service[] }) {
  return (
    <section className="px-gutter" data-sec="expertise">
      <WorkExpertise
        services={services}
        opening="I craft websites, apps, AI features and connected hardware that spark a moment of joy."
        action={
          <ServiceLink href="/services" label="View services" Icon={Sparkles} />
        }
      />
    </section>
  );
}

import { CircuitBoard } from "lucide-react";
import { ServiceService } from "@/servers/services/service.service";
import WorkTitle from "@/components/root/work/WorkTitle";
import WorkExpertise from "@/components/root/work/WorkExpertise";
import ServicesIntro from "@/components/root/services/ServicesIntro";
import ServicesOverview from "@/components/root/services/ServicesOverview";
import ServicesToolbar from "@/components/root/services/ServicesToolbar";

export default async function ServicesPage() {
  const services = await ServiceService.getAll();

  return (
    <article className="px-gutter pb-(--space-xl-2xl)">
      <div className="space-y-(--space-xl-2xl)">
        <WorkTitle
          labelLeft="Engineering"
          labelRight="Toolkit"
          heading="Services"
          compactLabel
          opening="Software and hardware, built end to end under one roof."
          art={<CircuitBoard className="size-full" strokeWidth={1} aria-hidden />}
        />
        <ServicesIntro />
        <ServicesOverview services={services} />
        <WorkExpertise
          services={services}
          heading={
            <>
              Where can <br />
              I help?
            </>
          }
          opening="Apps, devices or the data between them — tell me the problem and I'll engineer a fitting solution."
        />
      </div>
      <ServicesToolbar services={services} />
    </article>
  );
}

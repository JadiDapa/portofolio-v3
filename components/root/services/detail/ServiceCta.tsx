"use client";

import { Send } from "lucide-react";
import RevealHeading from "@/components/root/work/RevealHeading";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";
import ServiceLink from "./ServiceLink";

export default function ServiceCta({ slug }: { slug: string }) {
  const Icon = SERVICE_ICONS[slug] ?? DEFAULT_SERVICE_ICON;

  return (
    <section>
      <div
        data-cmp="cta"
        className="wk-b sd-cta-pad relative space-y-(--space-3xs-2xs) bg-[#0f0f0f] text-center text-white"
      >
        <p className="wk-label sd-title-label">
          <Icon className="sd-title-icon" strokeWidth={1} aria-hidden />
        </p>
        <div className="space-y-(--space-s-m)">
          <p className="sd-cta-heading text-balance">
            <RevealHeading text="Need help with your project?" lowercase inView />
          </p>
          <p className="wk-opening sd-opening mx-auto max-w-195 text-balance">
            Let’s work together!
          </p>
        </div>
      </div>

      <div className="wk-grid">
        <div className="col-span-2 sm:col-span-1 sm:col-start-2 lg:col-span-2 lg:col-start-2">
          <ServiceLink href="/contact" label="Send me a message" Icon={Send} />
        </div>
      </div>
    </section>
  );
}

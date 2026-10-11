"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { Service } from "@/generated/prisma";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";

/** Floating pill linking every service; the current one is expanded and filled. */
export default function ServiceSwitcher({
  services,
  active,
}: {
  services: Pick<Service, "id" | "slug" | "title">[];
  active: string;
}) {
  const nav = useRef<HTMLElement>(null);

  // On a narrow screen the pill scrolls; start with the current service centred
  useEffect(() => {
    const el = nav.current;
    const current = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !current) return;
    el.scrollLeft = current.offsetLeft - (el.clientWidth - current.offsetWidth) / 2;
  }, [active]);

  return (
    <nav ref={nav} className="sd-switcher" aria-label="Services" data-cmp="switcher">
      <Link href="/services" className="sd-sw-item" aria-label="All services">
        <LayoutGrid strokeWidth={1.2} aria-hidden />
        <span>Services</span>
      </Link>
      {services.map((service) => {
        const Icon = SERVICE_ICONS[service.slug] ?? DEFAULT_SERVICE_ICON;
        const current = service.slug === active;
        return (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="sd-sw-item"
            aria-label={service.title}
            aria-current={current ? "page" : undefined}
          >
            <Icon strokeWidth={1.2} aria-hidden />
            <span>{service.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { Info } from "lucide-react";
import type { Service } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";

/**
 * Pill pinned to the bottom of the viewport: an overview link plus one per
 * service. Only the current page's link is expanded to show its label.
 */
export default function ServicesToolbar({ services }: { services: Service[] }) {
  const pathname = usePathname();
  const nav = useRef<HTMLElement>(null);

  // The expanded pill is as wide as its label, so publish each label's width.
  useLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    const measure = () => {
      for (const a of el.querySelectorAll<HTMLElement>("a")) {
        const text = a.querySelector<HTMLElement>(".sv-toolbar-text");
        if (text) a.style.setProperty("--item-width", `${text.getBoundingClientRect().width}px`);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [services]);

  const items = [
    { href: "/services", label: "Services", Icon: Info },
    ...services.slice(0, 4).map((s) => ({
      href: `/services/${s.slug}`,
      label: s.title,
      Icon: SERVICE_ICONS[s.slug] ?? DEFAULT_SERVICE_ICON,
    })),
  ];

  return (
    <div data-cmp="toolbar" className="sv-toolbar">
      <nav ref={nav}>
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={pathname === href ? "page" : undefined}
            className={cn(pathname === href && "is-active")}
          >
            <Icon strokeWidth={1.5} aria-hidden />
            <span className="sv-toolbar-text">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

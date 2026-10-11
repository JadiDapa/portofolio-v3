"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * Footer nav row. Hovering one row greys the others, slides an arrow in and
 * draws a bar on the hovered row's left edge; the current page keeps its bar.
 */
export default function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const current = href === "/" ? pathname === "/" : pathname === href;

  return (
    <Link
      href={href}
      className="hm-foot-link"
      aria-current={current ? "page" : undefined}
    >
      <ArrowRight strokeWidth={1.5} className="hm-foot-arrow" aria-hidden />
      <span className="hm-foot-label">{children}</span>
    </Link>
  );
}

"use client";

import { usePathname } from "next/navigation";

/**
 * Renders `contact` on /contact and `children` everywhere else, so the shared
 * shell (navbar CTA, footer CTA) can step aside for the contact page's own UI.
 */
export default function ContactAware({
  children,
  contact = null,
}: {
  children?: React.ReactNode;
  contact?: React.ReactNode;
}) {
  return usePathname() === "/contact" ? contact : children;
}

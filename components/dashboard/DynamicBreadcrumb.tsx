"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Route segment to the label used everywhere else in the dashboard
const LABELS: Record<string, string> = {
  posts: "Journal",
  projects: "Work",
  create: "New",
  update: "Edit",
};

/** "Dashboard / Journal / Edit / my-slug". "update" has no page of its own, so it is not a link. */
export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "dashboard"

  return (
    <nav aria-label="Breadcrumb" className="db-crumb">
      <Link href="/dashboard">Dashboard</Link>

      {segments.map((segment, index) => {
        const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label =
          LABELS[segment] ??
          decodeURIComponent(segment).replace(/^./, (c) => c.toUpperCase());

        return (
          <span key={href} className="db-crumb_item">
            <span aria-hidden>/</span>
            {isLast ? (
              <span aria-current="page" className="db-crumb_here">
                {label}
              </span>
            ) : segment === "update" ? (
              <span>{label}</span>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

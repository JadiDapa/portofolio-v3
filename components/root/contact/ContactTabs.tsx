"use client";

import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import GridButton from "@/components/root/work/GridButton";
import { CONTACT_FORM_TYPES } from "@/servers/validators/contact.validator";

export function useContactFormType() {
  const form = useSearchParams().get("form");
  return form === "general" ? "general" : "enquiry";
}

/**
 * Enquiry / General switch. Sits in the header row above the form on desktop
 * (`header`) and drops under the title box on smaller screens.
 */
export default function ContactTabs({ header }: { header?: boolean }) {
  const active = useContactFormType();

  return (
    <div
      className={cn(
        "ct-tabs grid grid-cols-2",
        header ? "col-span-2 col-start-3 hidden lg:grid" : "ct-tabs--inline lg:hidden",
      )}
      data-cmp={header ? "tabs" : "tabs-inline"}
    >
      {CONTACT_FORM_TYPES.map((type) => (
        <div key={type}>
          <GridButton
            href={type === "enquiry" ? "/contact" : `/contact?form=${type}`}
            dark={type === active}
            className="ct-btn ct-btn--expand"
            ariaLabel={`${type} form`}
            ariaCurrent={type === active ? "page" : undefined}
          >
            <span className="ct-btn-text">{type}</span>
            <ChevronDown strokeWidth={1.5} aria-hidden />
          </GridButton>
        </div>
      ))}
    </div>
  );
}

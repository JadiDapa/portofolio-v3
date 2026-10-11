import Link from "next/link";
import { Suspense } from "react";
import { Rocket } from "lucide-react";
import { MenuOverlay } from "@/components/root/MenuOverlay";
import ContactAware from "@/components/root/contact/ContactAware";
import ContactTabs from "@/components/root/contact/ContactTabs";
import ServiceLink from "@/components/root/services/detail/ServiceLink";

/**
 * In-flow header: wordmark block + CTA. It scrolls away with the page; the
 * hamburger and monogram tile live in MenuOverlay's fixed bar.
 */
export default function Navbar() {
  return (
    <header className="hm-header px-gutter pt-(--gutter-pad) relative z-20">
      <div className="page-grid">
        <div className="hm-logo col-span-full md:col-span-2">
          <Link href="/" className="hm-logo-link" aria-label="Home">
            JADIDAPA
          </Link>
        </div>

        {/* The contact page puts its Enquiry / General tabs here instead */}
        <ContactAware
          contact={
            <Suspense>
              <ContactTabs header />
            </Suspense>
          }
        >
          <div className="hidden md:col-start-2 md:block lg:col-start-4">
            <ServiceLink href="/contact" label="Hire me" Icon={Rocket} />
          </div>
        </ContactAware>
      </div>

      <MenuOverlay />
    </header>
  );
}

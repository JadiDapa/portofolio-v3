import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/root/ThemeToggle";
import { HoverShadowBox } from "@/components/root/HoverShadowBox";
import { MenuOverlay } from "@/components/root/MenuOverlay";

const NAV_LINKS = [
  { title: "Projects", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Journal", href: "/journal" },
];

export default async function Navbar() {
  return (
    <header className="px-gutter relative z-10 pt-6 lg:pt-9">
      <div className="page-grid">
        {/* Logo tile */}
        <div className="flex">
          <MenuOverlay />
          <Link
            href="/"
            className="border-foreground bg-foreground text-background flex h-21 flex-1 items-center border border-b-0 px-8 text-4xl font-bold tracking-tight uppercase"
          >
            JADIDAPA
          </Link>
        </div>

        {/* CTA */}
        <div className="col-start-4 flex">
          <ThemeToggle />

          <HoverShadowBox className="flex-1">
            <Link
              href="/contact"
              className="border-foreground bg-background relative flex h-21 items-center justify-between gap-3 border border-b-0 px-5 text-lg font-medium tracking-[0.15em] uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
            >
              Hire me
              <ArrowRight className="size-8" />
            </Link>
          </HoverShadowBox>
        </div>
      </div>
    </header>
  );
}

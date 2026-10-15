"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Rocket, X } from "lucide-react";
import GridButton from "@/components/root/work/GridButton";
import ServiceLink from "@/components/root/services/detail/ServiceLink";
import { EXTRA_LINKS, MENU_LINKS } from "@/components/root/siteLinks";

/**
 * Fixed hamburger + monogram tile, and the full-screen menu they open. The
 * panel is always mounted and revealed with a left-to-right clip wipe.
 */
export function MenuOverlay() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLDivElement>(null);

  // Close when the route changes (adjusting state during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const opener = toggle.current?.querySelector("button");
    menu.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Monogram tile: sits under the in-flow wordmark, takes over once it scrolls away */}
      <div className="hm-fab hm-fab--mono px-gutter pt-(--gutter-pad)" aria-hidden>
        <div className="hm-fab-row">
          <div className="hm-mono-clip">
            <Link href="/" tabIndex={-1} className="hm-mono">
              D
            </Link>
          </div>
        </div>
      </div>

      <div className="hm-fab hm-fab--btn px-gutter pt-(--gutter-pad)">
        <div ref={toggle} className="hm-fab-row">
          <GridButton
            icon
            dark={open}
            onClick={() => setOpen((v) => !v)}
            ariaLabel={open ? "Close menu" : "Open menu"}
            ariaExpanded={open}
            ariaControls="site-menu"
            className="hm-menu-btn"
          >
            {open ? (
              <X strokeWidth={1.2} aria-hidden />
            ) : (
              <Menu strokeWidth={1.2} aria-hidden />
            )}
          </GridButton>
        </div>
      </div>

      <div
        ref={menu}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="hm-menu"
        data-open={open || undefined}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="hm-menu-rules px-gutter" aria-hidden>
          <div className="page-grid h-full">
            <div />
            <div className="hm-menu-rule" />
            <div className="hm-menu-rule hidden lg:block" />
            <div className="hm-menu-rule hidden lg:block" />
          </div>
        </div>

        <div className="hm-menu-inner px-gutter py-(--gutter-pad)">
          {/* Dark copy of the header row */}
          <div className="page-grid">
            <div className="hm-logo col-span-full md:col-span-2">
              <Link href="/" onClick={close} className="hm-logo-link hm-logo-link--dark">
                DAPA
              </Link>
            </div>
            <div className="hidden md:col-start-2 md:block lg:col-start-4">
              <ServiceLink
                href="/contact"
                label="Hire me"
                Icon={Rocket}
                dark
                onClick={close}
              />
            </div>
          </div>

          <nav className="hm-menu-nav">
            {MENU_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={close}
                className="hm-menu-link"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="hm-menu-bottom">
            {EXTRA_LINKS.map((link) => (
              <ServiceLink
                key={link.title}
                href={link.href}
                label={link.title}
                Icon={link.icon}
                dark
                onClick={close}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

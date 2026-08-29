"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Menu, Newspaper, X } from "lucide-react";

const MAIN_LINKS = [
  { title: "Work", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Contact", href: "/contact" },
];

const BOTTOM_LINKS = [
  { title: "Journal", href: "/journal", icon: Newspaper },
  { title: "GitHub", href: "#", icon: ArrowUpRight },
  { title: "LinkedIn", href: "#", icon: ArrowUpRight },
  { title: "Resume", href: "#", icon: ArrowUpRight },
];

export function MenuOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="group relative">
        <span aria-hidden className="bg-foreground absolute inset-0" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="border-foreground bg-background relative flex size-21 translate-x-0 translate-y-0 items-center justify-center border border-b-0 transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
        >
          <Menu className="size-8" />
        </button>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div
                key="menu-overlay"
                className="fixed inset-0 z-999 h-dvh overflow-hidden"
              >
                {/* Panel — fully rendered underneath the curtain at all times */}
                <div className="bg-foreground relative flex h-full w-full flex-col text-white">
                  {/* Inverted column grid rules, matching the page's page-grid */}
                  <div
                    aria-hidden
                    className="page-grid px-gutter pointer-events-none absolute inset-0"
                  >
                    <div className="border-grid h-full border-r">
                      <div className="border-grid border-l" />
                      <div className="border-grid border-l lg:block" />
                      <div className="border-grid border-l md:block" />
                      <div className="border-grid border-l lg:block" />
                    </div>
                  </div>

                  {/* Top bar */}
                  <div className="page-grid px-gutter border-background/20 shrink-0 border-b pt-6 lg:pt-9">
                    <div className="flex">
                      <div className="group relative">
                        <span
                          aria-hidden
                          className="bg-background absolute inset-0"
                        />
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          aria-label="Close menu"
                          className="border-background bg-foreground relative flex size-21 translate-x-0 translate-y-0 items-center justify-center border border-b-0 text-white transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                        >
                          <X className="size-8" />
                        </button>
                      </div>
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className="border-background bg-background text-foreground flex h-21 flex-1 items-center border border-b-0 px-8 text-4xl font-bold tracking-tight uppercase"
                      >
                        JADIDAPA
                      </Link>
                    </div>

                    <div className="col-start-4 flex">
                      <div className="group relative flex-1">
                        <span
                          aria-hidden
                          className="bg-background absolute inset-0"
                        />
                        <Link
                          href="/contact"
                          onClick={() => setOpen(false)}
                          className="border-background bg-foreground relative flex h-21 items-center justify-between gap-3 border border-b-0 px-5 text-lg font-medium tracking-[0.15em] text-white uppercase transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
                        >
                          Hire me
                          <ArrowRight className="size-8" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Main links — fills remaining space, rows always sum to 100% */}
                  <nav className="grid min-h-0 flex-1 grid-rows-4">
                    {MAIN_LINKS.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="border-background/20 hover:bg-background hover:text-foreground group flex items-center justify-center border-b transition-colors duration-300 ease-out"
                      >
                        <span className="flex items-center gap-4 text-4xl leading-none font-bold tracking-tight uppercase sm:text-6xl lg:text-7xl">
                          {link.title}
                          <ArrowRight className="size-8 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 sm:size-10" />
                        </span>
                      </Link>
                    ))}
                  </nav>

                  {/* Bottom links */}
                  <div className="grid shrink-0 grid-cols-2 sm:grid-cols-4">
                    {BOTTOM_LINKS.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="border-background/20 hover:bg-background hover:text-foreground flex items-center justify-between gap-3 border-t p-6 text-lg font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ease-out"
                      >
                        {link.title}
                        <link.icon className="size-4" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Curtain — solid, page-background-colored cover that slides off
                to the right on open (ease-out) revealing the panel, and
                slides back to cover it on close before unmounting. */}
                <motion.div
                  initial={{ x: "0%" }}
                  animate={{ x: "100%" }}
                  exit={{ x: "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-background pointer-events-none absolute inset-0"
                />
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

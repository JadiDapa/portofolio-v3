import Link from "next/link";
import {
  ArrowRight,
  Asterisk,
  Globe,
  Mail,
  Smile,
  ThumbsUp,
} from "lucide-react";
import NameReveal from "./NameReveal";

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "Projects", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const SERVICE_LINKS = [
  { title: "Services", href: "/services" },
  { title: "Web Development", href: "/services/web-development" },
  { title: "App Development", href: "/services/app-development" },
  { title: "AI & Machine Learning", href: "/services/ai-machine-learning" },
  { title: "IoT & Hardware", href: "/services/iot-hardware" },
];

const BUTTON_LINKS = [
  { title: "Journal", href: "/journal" },
  { title: "GitHub", href: "#" },
  { title: "LinkedIn", href: "#" },
  { title: "Resume", href: "#" },
];

export default function Footer() {
  return (
    <footer className="px-gutter relative z-10 pt-24 pb-8">
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="flex h-full flex-col">
          <div className="border-foreground ml-auto flex size-20 shrink-0 items-center justify-center border">
            <ThumbsUp className="size-8" />
          </div>
          <div className="border-foreground grid flex-1 grid-cols-2 border">
            <nav className="border-foreground border-r p-6 py-8">
              <ul className="flex flex-col space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group text-foreground hover:text-foreground flex items-center gap-2 font-medium tracking-[0.15em] uppercase transition-colors"
                    >
                      <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="p-6 py-8">
              <ul className="flex flex-col space-y-3">
                {SERVICE_LINKS.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group text-foreground hover:text-foreground flex items-center gap-2 font-medium tracking-[0.15em] uppercase transition-colors"
                    >
                      <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        {/* Dark CTA block */}
        <div className="bg-foreground text-background flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
          <Mail className="size-6" />
          <div>
            <p className="text-section leading-none font-bold tracking-tight uppercase">
              Let&apos;s go!
            </p>
            <p className="text-background mt-3 text-2xl">
              Let&apos;s work together!
            </p>
          </div>
          <Link
            href="/contact"
            className="border-background/20 bg-background hover:bg-background hover:text-foreground text-foreground inline-flex w-full items-center justify-between gap-3 border p-8 font-medium tracking-wide uppercase transition-colors"
          >
            Send me a message
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {BUTTON_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="border-foreground hover:bg-foreground hover:text-background flex justify-between gap-3 border border-t-0 p-8 text-lg font-semibold tracking-[0.15em] uppercase transition-colors"
          >
            {link.title}
            <ArrowRight className="size-3" />
          </Link>
        ))}
      </div>

      {/* Legal bar */}
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex">
          <div className="border-foreground bg-foreground text-background flex size-20 shrink-0 items-center justify-center border">
            <Asterisk className="size-12" />
          </div>

          <div className="border-foreground flex size-20 shrink-0 items-center justify-center border">
            <Smile className="size-12" />
          </div>
        </div>

        <div className="text-foreground text-center text-xs">
          <p>
            All work © Daffa Althaf Ridovani 2026. All rights reserved.
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            |
            <Link href="#" className="underline">
              Terms
            </Link>
          </p>
          <p className="mt-1">
            Software Engineer at Taruna Anugerah Mandiri · Based in Indonesia
          </p>
        </div>

        <div className="flex">
          <div className="border-foreground bg-foreground text-background flex size-20 shrink-0 items-center justify-center border">
            <Globe className="size-12" />
          </div>

          <div className="border-foreground flex h-20 shrink-0 items-center justify-center border px-12 text-2xl">
            V 3.0
          </div>
        </div>
      </div>
      {/* Oversized wordmark */}
      <NameReveal />
    </footer>
  );
}

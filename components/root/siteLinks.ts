import { ArrowUpRight, BookOpen, MessageCircle, type LucideIcon } from "lucide-react";

export type SiteLink = { title: string; href: string };
export type IconLink = SiteLink & { icon: LucideIcon };

export const SOCIAL = {
  github: "https://github.com/JadiDapa/",
  linkedin: "https://www.linkedin.com/in/daffa-althaf-ridovani/",
  resume: "/resume.pdf",
  whatsapp: "https://wa.me/6289523927152",
} as const;

/** Journal plus the off-site links, shown as buttons in the menu and footer. */
export const EXTRA_LINKS: IconLink[] = [
  { title: "Journal", href: "/journal", icon: BookOpen },
  { title: "GitHub", href: SOCIAL.github, icon: ArrowUpRight },
  { title: "LinkedIn", href: SOCIAL.linkedin, icon: ArrowUpRight },
  { title: "Resume", href: SOCIAL.resume, icon: ArrowUpRight },
];

/** Footer variant of EXTRA_LINKS: WhatsApp replaces Journal. */
export const FOOTER_EXTRA_LINKS: IconLink[] = EXTRA_LINKS.map((link) =>
  link.href === "/journal"
    ? { title: "WhatsApp", href: SOCIAL.whatsapp, icon: MessageCircle }
    : link,
);

export const MENU_LINKS: SiteLink[] = [
  { title: "Work", href: "/work" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Contact", href: "/contact" },
];

export const FOOTER_PAGE_LINKS: SiteLink[] = [{ title: "Home", href: "/" }, ...MENU_LINKS.filter((l) => l.href !== "/services")];

export const FOOTER_SERVICE_LINKS: SiteLink[] = [
  { title: "Services", href: "/services" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "IoT & AI Systems", href: "/services/iot-ai-systems" },
  { title: "Electrical Engineering", href: "/services/electrical-engineering" },
  { title: "Process & Control", href: "/services/process-control-engineering" },
];

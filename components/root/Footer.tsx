import Link from "next/link";
import { Asterisk, Mail, Send, Smile, ThumbsUp } from "lucide-react";
import NameReveal from "./NameReveal";
import ThemeToggle from "./ThemeToggle";
import ContactAware from "./contact/ContactAware";
import FooterLink from "./FooterLink";
import ChatTitle from "./ChatTitle";
import ServiceLink from "./services/detail/ServiceLink";
import { FOOTER_EXTRA_LINKS, FOOTER_PAGE_LINKS, FOOTER_SERVICE_LINKS } from "./siteLinks";

export default function Footer() {
  return (
    <footer className="hm-footer px-gutter relative z-10">
      <div className="hm-foot">
        <div className="hm-foot-thumb sv-tile wk-b flex">
          <ThumbsUp strokeWidth={1.2} aria-hidden />
        </div>

        <nav className="hm-foot-menu hm-foot-menu--1 wk-b" aria-label="Pages">
          {FOOTER_PAGE_LINKS.map((link) => (
            <FooterLink key={link.title} href={link.href}>
              {link.title}
            </FooterLink>
          ))}
        </nav>

        <nav className="hm-foot-menu hm-foot-menu--2 wk-b" aria-label="Services">
          {FOOTER_SERVICE_LINKS.map((link) => (
            <FooterLink key={link.title} href={link.href}>
              {link.title}
            </FooterLink>
          ))}
        </nav>

        {/* Dark CTA block, redundant on the contact page itself */}
        <ContactAware>
          <div className="hm-chat">
            <Mail strokeWidth={1.3} className="hm-chat-icon" aria-hidden />
            <ChatTitle text="LET'S GO!" />
            <p className="hm-chat-sub">Let&apos;s work together!</p>
            <ServiceLink
              href="/contact"
              label="Send me a message"
              Icon={Send}
              className="hm-chat-btn"
            />
          </div>
        </ContactAware>

        <div className="hm-foot-links">
          {FOOTER_EXTRA_LINKS.map((link) => (
            <ServiceLink
              key={link.title}
              href={link.href}
              label={link.title}
              Icon={link.icon}
            />
          ))}
        </div>

        <div className="hm-foot-legal">
          <div className="flex">
            <div className="sv-tile sv-tile--dark hm-hide-sm flex">
              <Asterisk strokeWidth={2.2} aria-hidden />
            </div>
            <div className="sv-tile wk-b flex">
              <Smile strokeWidth={1.2} aria-hidden />
            </div>
          </div>

          <div className="hm-foot-text">
            <p>
              All work © Daffa Althaf Ridovani {new Date().getFullYear()}. All rights reserved.{" "}
              <Link href="#">Privacy Policy</Link> | <Link href="#">Terms</Link>
            </p>
            <p>Software Engineer at Taruna Anugerah Mandiri · Based in Indonesia</p>
          </div>

          <div className="flex">
            <ThemeToggle />
            <div className="sv-tile wk-b hm-foot-version hm-hide-sm flex">V 3.0</div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <NameReveal />
      </div>
    </footer>
  );
}

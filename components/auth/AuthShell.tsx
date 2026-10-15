import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  /** Use *asterisks* around a word to set it as an outline. */
  title: string;
  subtitle: string;
  children: ReactNode;
  altText: string;
  altHref: string;
  altLabel: string;
};

const PHRASES = "Back office / Dapa / Words, work and the people who write to me / ";

/** Shared frame for sign in and sign up: ink panel on the left, paper form on the right. */
export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  altText,
  altHref,
  altLabel,
}: Props) {
  const parts = title.split(/\*(.+?)\*/g);

  return (
    <div className="db-auth">
      <aside className="db-auth_art" aria-hidden>
        <div className="db-auth_top">
          <span className="db-auth_mono">J</span>
          <span className="wk-label">V 3.0 / Admin</span>
        </div>

        <p className="db-auth_big">
          <span>Back</span>
          <span className="out">Office</span>
          <span className="pink">&darr;</span>
        </p>

        <div className="db-auth_strip">
          <div>
            {PHRASES.repeat(6)}
            {PHRASES.repeat(6)}
          </div>
        </div>
      </aside>

      <main className="db-auth_main">
        <header className="db-auth_head">
          <span className="wk-label text-[#b3b3b3]">{eyebrow}</span>
          <h1 className="db-auth_title">
            {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p))}
          </h1>
          <p className="db-auth_sub">{subtitle}</p>
        </header>

        {children}

        <div className="db-auth_alt">
          <span>{altText}</span>
          <Link href={altHref} className="db-act">
            {altLabel}
          </Link>
          <Link href="/" className="db-act ml-auto">
            Back to site
          </Link>
        </div>
      </main>
    </div>
  );
}

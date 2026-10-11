"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ArrowUpRight, LogOut, Menu, Search, X } from "lucide-react";
import type { User } from "@/generated/prisma";
import { filterMenuByRole, overviewItems } from "@/lib/sidebar-menu";
import type { SearchEntry } from "@/servers/services/search.service";
import CommandPalette from "./CommandPalette";

type Props = {
  user: User;
  /** Unread inquiries, shown in pink next to "Inquiries". */
  unread: number;
  /** Titles for the ⌘K palette. */
  entries: SearchEntry[];
};

const pad2 = (n: number) => String(n).padStart(2, "0");

function isActive(pathname: string, url: string) {
  return url === "/dashboard"
    ? pathname === url
    : pathname === url || pathname.startsWith(`${url}/`);
}

export default function DbRail({ user, unread, entries }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  // The sheet is open only for the path it was opened on, so navigating closes it
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const [paletteOpen, setPaletteOpen] = useState(false);

  const items = filterMenuByRole(overviewItems, user.role);
  const current = items.find((i) => isActive(pathname, i.url));

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  const nav = (
    <nav className="db-nav" aria-label="Dashboard">
      {items.map((item, i) => (
        <Link
          key={item.url}
          href={item.url}
          className="db-link"
          aria-current={isActive(pathname, item.url) ? "page" : undefined}
        >
          <span className="db-link_num">({pad2(i + 1)})</span>
          <span className="db-link_label">{item.title}</span>
          {item.url === "/dashboard/inquiries" && unread > 0 && (
            <span className="db-link_count" aria-label={`${unread} unread`}>
              {unread}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="db-rail">
        <div className="db-rail_head">
          <Link href="/dashboard" className="db-mono" aria-label="Dashboard home">
            J
          </Link>
          <div className="db-rail_brand">
            <strong>Back office</strong>
            <span>Daffa Althaf</span>
          </div>
        </div>

        <button
          type="button"
          className="db-searchbtn"
          onClick={() => setPaletteOpen(true)}
        >
          <Search size={16} strokeWidth={1.5} aria-hidden />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>

        {nav}

        <div className="db-rail_foot">
          <div className="db-user">
            <strong>{user.name ?? user.username}</strong>
            <span>@{user.username}</span>
          </div>
          <div className="db-rail_actions">
            <Link href="/" className="db-mini" target="_blank">
              Site <ArrowUpRight />
            </Link>
            <button type="button" className="db-mini" onClick={handleSignOut}>
              Out <LogOut />
            </button>
          </div>
          <div className="db-version">V 3.0 / Admin</div>
        </div>
      </aside>

      {/* Mobile top bar + wipe sheet */}
      <header className="db-top">
        <Link href="/dashboard" className="db-mono" aria-label="Dashboard home">
          J
        </Link>
        <div className="db-top_title">{current?.title ?? "Back office"}</div>
        <button
          type="button"
          className="db-top_toggle"
          aria-label="Search"
          onClick={() => setPaletteOpen(true)}
        >
          <Search size={20} strokeWidth={1.4} />
        </button>
        <button
          type="button"
          className="db-top_toggle"
          aria-expanded={open}
          aria-controls="db-sheet"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? <X size={22} strokeWidth={1.4} /> : <Menu size={22} strokeWidth={1.4} />}
        </button>
      </header>
      <div id="db-sheet" className="db-sheet" data-open={open}>
        {nav}
        <div className="db-rail_actions" style={{ marginTop: "auto" }}>
          <Link href="/" className="db-mini" target="_blank">
            Site <ArrowUpRight />
          </Link>
          <button type="button" className="db-mini" onClick={handleSignOut}>
            Out <LogOut />
          </button>
        </div>
      </div>
      <CommandPalette
        role={user.role}
        entries={entries}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
      />
    </>
  );
}

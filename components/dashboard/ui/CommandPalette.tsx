"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { CornerDownLeft, Search } from "lucide-react";
import type { SearchEntry } from "@/servers/services/search.service";
import { filterMenuByRole, overviewItems } from "@/lib/sidebar-menu";

const CREATE = [
  { title: "New project", href: "/dashboard/projects/create" },
  { title: "New journal entry", href: "/dashboard/posts/create" },
  { title: "New service", href: "/dashboard/services/create" },
];

type Props = {
  role: string;
  entries: SearchEntry[];
  /** Controlled by the rail's search tile; ⌘K / Ctrl+K also toggles it. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** ⌘K: jump to any page, start something new, or open an existing entry. */
export default function CommandPalette({ role, entries, open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function go(href: string, external = false) {
    onOpenChange(false);
    setQuery("");
    if (external) window.open(href, "_blank", "noreferrer");
    else router.push(href);
  }

  const pages = filterMenuByRole(overviewItems, role);
  const groups = ["Work", "Journal", "Services"] as const;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      overlayClassName="db-cmd_overlay"
      contentClassName="db-cmd"
      loop
    >
      <div className="db-cmd_input">
        <Search size={18} strokeWidth={1.4} aria-hidden />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Jump to a page, or find an entry…"
        />
        <kbd>Esc</kbd>
      </div>

      <Command.List>
        <Command.Empty>Nothing by that name.</Command.Empty>

        <Command.Group heading="Go to">
          {pages.map((p, i) => (
            <Command.Item
              key={p.url}
              value={`go ${p.title}`}
              onSelect={() => go(p.url)}
            >
              <span className="db-cmd_num">({String(i + 1).padStart(2, "0")})</span>
              {p.title}
              <CornerDownLeft className="db-cmd_enter" size={14} />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Create">
          {CREATE.map((c) => (
            <Command.Item key={c.href} value={c.title} onSelect={() => go(c.href)}>
              <span className="db-cmd_num">+</span>
              {c.title}
              <CornerDownLeft className="db-cmd_enter" size={14} />
            </Command.Item>
          ))}
        </Command.Group>

        {groups.map((g) => {
          const list = entries.filter((e) => e.group === g);
          if (list.length === 0) return null;
          return (
            <Command.Group key={g} heading={`Edit · ${g}`}>
              {list.map((e) => (
                <Command.Item
                  key={e.href}
                  value={`${g} ${e.title}`}
                  onSelect={() => go(e.href)}
                >
                  <span className="db-cmd_num">↗</span>
                  <span className="truncate">{e.title}</span>
                  <CornerDownLeft className="db-cmd_enter" size={14} />
                </Command.Item>
              ))}
            </Command.Group>
          );
        })}

        <Command.Group heading="Elsewhere">
          <Command.Item value="open public site" onSelect={() => go("/", true)}>
            <span className="db-cmd_num">↗</span>
            Open the public site
            <CornerDownLeft className="db-cmd_enter" size={14} />
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="db-cmd_foot">
        <span>↑↓ move</span>
        <span>↵ open</span>
        <span>⌘K toggle</span>
      </div>
    </Command.Dialog>
  );
}

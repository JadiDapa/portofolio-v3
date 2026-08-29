"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know the stored theme until after hydration, so render a
  // same-sized placeholder first to avoid a mismatch and layout shift.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-hidden className="border-grid size-14 border" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="hover:bg-background bg-foreground text-background hover:text-foreground flex size-21 items-center justify-center transition-colors"
    >
      {isDark ? <Sun className="size-8" /> : <Moon className="size-8" />}
    </button>
  );
}

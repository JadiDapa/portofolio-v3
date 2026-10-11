"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** Grid tile that flips light / dark. Sits in the footer's legal bar. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know the stored theme until after hydration, so render a
  // same-sized placeholder first to avoid a mismatch and layout shift.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div aria-hidden className="sv-tile wk-b flex" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="sv-tile wk-b flex"
    >
      {isDark ? <Sun strokeWidth={1.3} /> : <Moon strokeWidth={1.3} />}
    </button>
  );
}

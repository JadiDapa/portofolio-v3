"use client";

import { useState } from "react";

/** Copies the page URL; the label flips to "Copied" for a moment. */
export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: leave the label alone rather than lie about it
    }
  }

  return (
    <button type="button" className="jn-aside_btn" onClick={copy}>
      <span>{copied ? "Copied" : "Copy link"}</span>
      <svg viewBox="0 0 24 24" className="size-[1.2em]" aria-hidden>
        <path
          d={
            copied
              ? "M5 12.5l4.5 4.5L19 7.5"
              : "M9 9h10v10H9zM5 15V5h10"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}

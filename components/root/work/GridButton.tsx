"use client";

import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type GridButtonProps = {
  children: React.ReactNode;
  className?: string;
  /** Slides the black fill in behind the label (active tab). */
  dark?: boolean;
  expand?: boolean;
  /** Square button for a single icon. */
  icon?: boolean;
  href?: string;
  onClick?: () => void;
  onPointerEnter?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Feeds the pointer's offset from centre (-1..1) to a `wk-btn_panel` as --cx/--cy. */
export function leanPanel(
  el: HTMLElement | null,
  e: React.PointerEvent<HTMLElement>,
) {
  if (!el) return;
  const r = e.currentTarget.getBoundingClientRect();
  const cx = (r.left + r.width / 2 - e.clientX) / (r.width / 2);
  const cy = (r.top + r.height / 2 - e.clientY) / (r.height / 2);
  el.style.setProperty("--cx", String(cx));
  el.style.setProperty("--cy", String(cy));
}

/**
 * Black base + light panel. On hover the panel lifts up-right, leaning towards
 * the cursor, which uncovers the base as a hard shadow.
 */
export default function GridButton({
  children,
  className,
  dark,
  expand,
  icon,
  href,
  onClick,
  onPointerEnter,
  ariaLabel,
  type = "button",
  disabled,
}: GridButtonProps) {
  const panel = useRef<HTMLSpanElement>(null);

  const track = (e: React.PointerEvent<HTMLElement>) => leanPanel(panel.current, e);

  const cls = cn(
    "wk-btn",
    dark && "wk-btn--dark",
    expand && "wk-btn--expand",
    icon && "wk-btn--icon",
    className,
  );

  const body = (
    <span ref={panel} className="wk-btn_panel wk-b">
      <span className="wk-btn_inner">{children}</span>
    </span>
  );

  if (href && /^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick}
        onPointerMove={track}
        onPointerEnter={onPointerEnter}
      >
        {body}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        aria-label={ariaLabel}
        onClick={onClick}
        onPointerMove={track}
        onPointerEnter={onPointerEnter}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cls}
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={track}
      onPointerEnter={onPointerEnter}
    >
      {body}
    </button>
  );
}

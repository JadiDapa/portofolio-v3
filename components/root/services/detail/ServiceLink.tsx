import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import GridButton from "@/components/root/work/GridButton";

export const ARROW_PATH =
  "M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173";

/** Expanding grid button: the arrow slides in from the left, the icon tilts on hover. */
export default function ServiceLink({
  href,
  label,
  Icon,
  dark,
  onClick,
  className,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  /** Black panel with white text, for use on the dark menu. */
  dark?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <GridButton
      href={href}
      expand
      dark={dark}
      onClick={onClick}
      className={cn("sv-link", className)}
    >
      <svg viewBox="0 0 24 24" fill="none" className="sv-link-left" aria-hidden>
        <path
          d={ARROW_PATH}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <span className="sv-link-text">{label}</span>
      <Icon className="sv-link-right" strokeWidth={1.5} aria-hidden />
    </GridButton>
  );
}

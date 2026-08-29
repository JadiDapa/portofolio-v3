"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface HoverPopButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function HoverPopButton({
  href,
  children,
  className = "",
}: HoverPopButtonProps) {
  return (
    <Link href={href} className={`group relative inline-flex ${className}`}>
      {/* hard shadow layer — hidden behind at rest, peeks out on hover */}
      <span
        aria-hidden
        className="bg-foreground absolute inset-0 translate-x-0 translate-y-0 transition-transform duration-300 ease-out group-hover:-translate-x-2 group-hover:translate-y-2"
      />

      {/* front content layer */}
      <span className="border-foreground bg-background relative flex w-full items-center justify-between gap-3 border px-6 py-4 font-medium tracking-wide uppercase">
        <span className="flex items-center gap-3">
          <ArrowRight className="size-4 -translate-x-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
          {children}
        </span>

        <Sparkles className="size-5 transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" />
      </span>
    </Link>
  );
}

"use client";

import { useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { leanPanel } from "@/components/root/work/GridButton";

/**
 * The public GridButton as a plain <button> that spreads its props, so it can be a
 * `DialogTrigger asChild` child. Same black base + lifting panel.
 */
export default function DbButton({
  children,
  className,
  onPointerMove,
  ...props
}: ComponentProps<"button"> & { dark?: boolean }) {
  const panel = useRef<HTMLSpanElement>(null);
  const { dark, ...rest } = props;

  return (
    <button
      type="button"
      {...rest}
      className={cn("wk-btn", dark && "wk-btn--dark", className)}
      onPointerMove={(e) => {
        leanPanel(panel.current, e);
        onPointerMove?.(e);
      }}
    >
      <span ref={panel} className="wk-btn_panel wk-b">
        <span className="wk-btn_inner">{children}</span>
      </span>
    </button>
  );
}

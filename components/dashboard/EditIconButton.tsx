import type { ComponentProps } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

/** Square pencil tile for row-level edit dialogs (spreads props so `DialogTrigger asChild` can attach). */
export default function EditIconButton({
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button type="button" className={cn("db-tile", className)} {...props}>
      <Pencil aria-hidden />
    </button>
  );
}

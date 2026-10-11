import { cn } from "@/lib/utils";

/** The four hairlines that draw in around a title block once `visible` flips on. */
export default function BoxFrame({
  visible,
  className,
}: {
  visible: boolean;
  className?: string;
}) {
  return (
    <div className={cn("wk-box", className)} data-visible={visible || undefined} aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

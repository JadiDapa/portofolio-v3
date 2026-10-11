"use client";

import { useEntered } from "@/hooks/use-entered";
import BoxFrame from "@/components/root/shared/BoxFrame";
import RevealHeading from "@/components/root/shared/RevealHeading";

/** Glass title box: four hairlines draw in while the letters rise. */
export default function ProjectTitle({ title }: { title: string }) {
  const visible = useEntered();

  return (
    <div className="relative p-(--space-s-m)">
      <BoxFrame visible={visible} />
      <h1 className="wk-heading wk-pt-heading relative">
        <RevealHeading text={title} lowercase />
      </h1>
    </div>
  );
}

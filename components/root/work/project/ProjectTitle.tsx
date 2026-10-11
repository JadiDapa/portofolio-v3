"use client";

import { useEffect, useState } from "react";
import RevealHeading from "../RevealHeading";

/** Glass title box: four hairlines draw in while the letters rise. */
export default function ProjectTitle({ title }: { title: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative p-(--space-s-m)">
      <div className="wk-box" data-visible={visible || undefined} aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>
      <h1 className="wk-heading wk-pt-heading relative">
        <RevealHeading text={title} lowercase />
      </h1>
    </div>
  );
}

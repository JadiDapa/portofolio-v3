import type { ReactNode } from "react";

/** A numbered group of fields: "(01) Basics" over a hairline. */
export default function FormSection({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="db-fs">
      <header className="db-fs_head">
        <span className="wk-label text-[#b3b3b3]">({String(num).padStart(2, "0")})</span>
        <h2 className="db-section_title">{title}</h2>
      </header>
      <div className="db-fs_body">{children}</div>
    </section>
  );
}

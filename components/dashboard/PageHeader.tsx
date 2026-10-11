import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Small uppercase line above the title, e.g. "(01) Library". */
  eyebrow?: string;
  /** Buttons aligned to the right of the title. */
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
}: PageHeaderProps) {
  return (
    <div className="db-head">
      <div>
        {eyebrow && <span className="wk-label db-head_eyebrow">{eyebrow}</span>}
        <h1 className="db-head_title">{title}</h1>
        {subtitle && <p className="db-head_sub">{subtitle}</p>}
      </div>
      {actions && <div className="db-head_actions">{actions}</div>}
    </div>
  );
}

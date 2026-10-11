"use client";

import { useEffect, useState, type FormEventHandler, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import DbButton from "./DbButton";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** Left pane: the fields. */
  children: ReactNode;
  /** Right pane: <LivePreview>. */
  preview: ReactNode;
  saving: boolean;
  dirty: boolean;
  submitLabel: string;
  cancelHref: string;
  /** Extra controls in the action bar, e.g. the Published switch. */
  status?: ReactNode;
  /** Strip above the panes, e.g. <DraftBanner>. */
  banner?: ReactNode;
};

/**
 * Two panes (fields | live preview), a sticky action bar and an unsaved-changes
 * guard. Below xl the panes become a Write / Preview toggle.
 */
export default function EditorShell({
  onSubmit,
  children,
  preview,
  saving,
  dirty,
  submitLabel,
  cancelHref,
  status,
  banner,
}: Props) {
  const router = useRouter();
  const [view, setView] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function cancel() {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    router.push(cancelHref);
  }

  return (
    <form onSubmit={onSubmit} className="db-editor" data-view={view}>
      {banner}

      <div className="db-editor_toggle db-tabs">
        <button
          type="button"
          aria-pressed={view === "write"}
          onClick={() => setView("write")}
        >
          Write
        </button>
        <button
          type="button"
          aria-pressed={view === "preview"}
          onClick={() => setView("preview")}
        >
          Preview
        </button>
      </div>

      <div className="db-editor_panes">
        <div className="db-editor_fields">{children}</div>
        <aside className="db-editor_preview" aria-label="Live preview">
          {preview}
        </aside>
      </div>

      <div className="db-actionbar">
        <span className="db-actionbar_state" data-dirty={dirty}>
          {saving ? "Saving…" : dirty ? "Unsaved changes" : "All saved"}
        </span>
        <div className="db-actionbar_ctrl">
          {status}
          <button type="button" className="db-act" onClick={cancel}>
            Cancel
          </button>
          <DbButton type="submit" dark disabled={saving}>
            {saving ? "Saving…" : submitLabel}
          </DbButton>
        </div>
      </div>
    </form>
  );
}

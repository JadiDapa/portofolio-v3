"use client";

import { useState, useSyncExternalStore } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { readDraft, removeDraft, type StoredDraft } from "./useFormDraft";

const noop = () => () => {};

/** False on the server and during hydration, true afterwards: keeps localStorage reads out of SSR. */
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

function ago(ms: number) {
  const mins = Math.round((Date.now() - ms) / 60000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (mins < 1) return "just now";
  if (mins < 60) return rtf.format(-mins, "minute");
  if (mins < 60 * 24) return rtf.format(-Math.round(mins / 60), "hour");
  return rtf.format(-Math.round(mins / 60 / 24), "day");
}

function Offer<T extends FieldValues>({
  storageKey,
  form,
}: {
  storageKey: string;
  form: UseFormReturn<T>;
}) {
  // Read once on mount, before the first autosave can overwrite it
  const [draft, setDraft] = useState<StoredDraft<T> | null>(() => {
    const found = readDraft<T>(storageKey);
    if (!found) return null;
    const same =
      JSON.stringify(found.values) === JSON.stringify(form.formState.defaultValues);
    return same ? null : found;
  });

  if (!draft) return null;

  return (
    <div className="db-draft" role="status">
      <span className="db-draft_text">
        <strong>Unsaved draft</strong> from {ago(draft.savedAt)} was found in this browser.
      </span>
      <span className="db-draft_ctrl">
        <button
          type="button"
          className="db-act"
          onClick={() => {
            // Keep the saved values as the baseline so the form shows as changed
            form.reset(draft.values, { keepDefaultValues: true });
            setDraft(null);
          }}
        >
          Restore
        </button>
        <button
          type="button"
          className="db-act"
          data-tone="danger"
          onClick={() => {
            removeDraft(storageKey);
            setDraft(null);
          }}
        >
          Discard
        </button>
      </span>
    </div>
  );
}

/** "Restore draft?" strip shown above an editor when a saved draft exists. */
export default function DraftBanner<T extends FieldValues>(props: {
  storageKey: string;
  form: UseFormReturn<T>;
}) {
  return useIsClient() ? <Offer {...props} /> : null;
}

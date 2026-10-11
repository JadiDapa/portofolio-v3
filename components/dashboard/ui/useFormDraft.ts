"use client";

import { useCallback, useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type StoredDraft<T> = { savedAt: number; values: T };

export function readDraft<T>(key: string): StoredDraft<T> | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as StoredDraft<T>) : null;
  } catch {
    return null;
  }
}

export function removeDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Private windows and blocked storage: drafts are a convenience, not a requirement
  }
}

/**
 * Saves the form to this browser a moment after each change, and drops the draft
 * again when the form is back to its saved state. Returns `clear`, to call after a
 * successful save.
 */
export function useFormDraft<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const sub = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          if (!form.formState.isDirty) {
            removeDraft(key);
            return;
          }
          const draft: StoredDraft<unknown> = { savedAt: Date.now(), values };
          window.localStorage.setItem(key, JSON.stringify(draft));
        } catch {
          // Quota exceeded or storage blocked: skip this save
        }
      }, 1500);
    });

    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [form, key]);

  return useCallback(() => removeDraft(key), [key]);
}

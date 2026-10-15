"use client";

import { X } from "lucide-react";
import { MAX_RELATED } from "@/servers/validators/project.validator";

export type ProjectOption = { id: number; title: string; published: boolean };

/**
 * Up to MAX_RELATED hand-picked projects for "Related Work", shown as chips in the
 * order they'll appear. Drafts can be picked but stay hidden until they're published.
 */
export default function RelatedProjectsField({
  value,
  onChange,
  options,
}: {
  value: number[];
  onChange: (next: number[]) => void;
  /** Every other project. */
  options: ProjectOption[];
}) {
  const byId = new Map(options.map((o) => [o.id, o]));
  const picked = value.filter((id) => byId.has(id));
  const rest = options.filter((o) => !picked.includes(o.id));
  const full = picked.length >= MAX_RELATED;

  return (
    <div className="db-field">
      <span className="db-label">Related projects</span>
      <p className="db-field_hint">
        Up to {MAX_RELATED}, shown in this order. With none or one picked, random
        projects fill it up to two.
      </p>

      {picked.length > 0 && (
        <div className="db-tags">
          {picked.map((id) => {
            const o = byId.get(id)!;
            return (
              <span key={id} className="db-tag">
                {o.title}
                {!o.published && " (draft)"}
                <button
                  type="button"
                  aria-label={`Remove ${o.title}`}
                  onClick={() => onChange(picked.filter((p) => p !== id))}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <select
        aria-label="Add a related project"
        value=""
        disabled={full}
        onChange={(e) => e.target.value && onChange([...picked, Number(e.target.value)])}
        className="db-input"
      >
        <option value="">
          {full ? `${MAX_RELATED} picked` : "Add a related project…"}
        </option>
        {rest.map((o) => (
          <option key={o.id} value={o.id}>
            {o.title}
            {!o.published && " (draft)"}
          </option>
        ))}
      </select>
    </div>
  );
}

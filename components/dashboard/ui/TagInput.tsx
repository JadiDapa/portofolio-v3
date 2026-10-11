"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Chip input. Enter, comma or Tab commits; Backspace on an empty field removes
 * the last chip; pasting "a, b, c" splits into chips. Duplicates are ignored.
 */
export default function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  id,
  label = "tag",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
  label?: string;
}) {
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const known = new Set(value.map((v) => v.toLowerCase()));
    const fresh: string[] = [];
    for (const part of raw.split(",")) {
      const t = part.trim();
      if (t && !known.has(t.toLowerCase())) {
        known.add(t.toLowerCase());
        fresh.push(t);
      }
    }
    if (fresh.length) onChange([...value, ...fresh]);
    setDraft("");
  }

  return (
    <div className="db-tags" onClick={() => input.current?.focus()}>
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="db-tag">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((_, j) => j !== i));
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </span>
      ))}
      <input
        ref={input}
        id={id}
        value={draft}
        aria-label={`Add ${label}`}
        placeholder={value.length ? "" : placeholder}
        className="db-tags_input"
        onChange={(e) => {
          const v = e.target.value;
          if (v.includes(",")) commit(v);
          else setDraft(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || (e.key === "Tab" && draft.trim())) {
            if (e.key === "Enter" || draft.trim()) e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && commit(draft)}
      />
    </div>
  );
}

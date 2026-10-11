"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import GridButton from "@/components/root/work/GridButton";
import ConfirmDelete from "../ui/ConfirmDelete";
import { getErrorMessage } from "@/lib/utils";
import { markInquiryRead, deleteInquiry } from "@/app/action/contact.action";

export interface InquiryTableType {
  id: number;
  name: string;
  company?: string | null;
  email: string;
  timeline?: string | null;
  budget?: string | null;
  message: string;
  projectTypes: string[];
  read: boolean;
  createdAt: Date;
}

interface InquiryTableProps {
  inquiries: InquiryTableType[];
}

const fmt = (d: Date) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/** Split inbox: envelopes on the left, the open letter on the right. */
export default function InquiryTable({ inquiries }: InquiryTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    inquiries[0]?.id ?? null,
  );
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return inquiries.filter(
      (i) =>
        (!onlyUnread || !i.read) &&
        (!q || `${i.name} ${i.email} ${i.company ?? ""}`.toLowerCase().includes(q)),
    );
  }, [inquiries, onlyUnread, query]);

  const unread = inquiries.filter((i) => !i.read).length;
  const selected = inquiries.find((i) => i.id === selectedId) ?? null;

  function setRead(id: number, read: boolean) {
    startTransition(async () => {
      try {
        await markInquiryRead(id, read);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  function open(inquiry: InquiryTableType) {
    setSelectedId(inquiry.id);
    // Opening a letter reads it
    if (!inquiry.read) setRead(inquiry.id, true);
  }

  return (
    <div>
      <div className="db-bar">
        <div className="db-tabs">
          <button
            type="button"
            aria-pressed={!onlyUnread}
            onClick={() => setOnlyUnread(false)}
          >
            All <sup>{String(inquiries.length).padStart(2, "0")}</sup>
          </button>
          <button
            type="button"
            aria-pressed={onlyUnread}
            onClick={() => setOnlyUnread(true)}
          >
            Unread <sup>{String(unread).padStart(2, "0")}</sup>
          </button>
        </div>
        <div className="db-bar_filters">
          <input
            className="db-input"
            placeholder="Name, email or company"
            aria-label="Search inquiries"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="db-inbox">
        <div className="db-inbox_list">
          {visible.length === 0 && (
            <p className="db-cell-sub p-6">No letters here.</p>
          )}
          {visible.map((i) => (
            <button
              key={i.id}
              type="button"
              className="db-mail"
              data-unread={!i.read}
              aria-current={i.id === selectedId}
              onClick={() => open(i)}
            >
              <span className="db-mail_name">
                <span className="line-clamp-1">{i.name}</span>
                <span className="db-mail_date">{fmt(i.createdAt)}</span>
              </span>
              <span className="db-mail_snip">{i.message}</span>
            </button>
          ))}
        </div>

        {selected ? (
          <article className="db-letter" key={selected.id}>
            <span
              className="db-stamp db-letter_stamp"
              data-tone={selected.read ? "quiet" : "alert"}
            >
              {selected.read ? "Read" : "New"}
            </span>

            <div>
              <span className="wk-label text-[#b3b3b3]">
                From / {fmt(selected.createdAt)}
                {selected.company ? ` / ${selected.company}` : ""}
              </span>
              <h2 className="db-letter_from">{selected.name}</h2>
              <a href={`mailto:${selected.email}`} className="db-act">
                {selected.email}
              </a>
            </div>

            <div className="db-letter_meta">
              {selected.projectTypes.map((t) => (
                <span key={t} className="db-chip">
                  {t}
                </span>
              ))}
              {selected.budget && (
                <span className="db-chip">Budget · {selected.budget}</span>
              )}
              {selected.timeline && (
                <span className="db-chip">Timeline · {selected.timeline}</span>
              )}
            </div>

            <p className="db-letter_body">{selected.message}</p>

            <div className="db-letter_actions">
              <GridButton
                href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your inquiry")}`}
              >
                Reply
              </GridButton>
              <button
                type="button"
                className="db-act"
                disabled={isPending}
                onClick={() => setRead(selected.id, !selected.read)}
              >
                Mark {selected.read ? "unread" : "read"}
              </button>
              <ConfirmDelete
                name={selected.name}
                success="Inquiry deleted"
                onConfirm={() => deleteInquiry(selected.id)}
              />
            </div>
          </article>
        ) : (
          <div className="db-letter_empty">
            <span className="wk-label">Pick a letter</span>
          </div>
        )}
      </div>
    </div>
  );
}

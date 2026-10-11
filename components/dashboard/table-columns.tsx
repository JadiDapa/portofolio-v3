import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import ConfirmDelete from "./ui/ConfirmDelete";

/** Giant outlined position number. It follows the current sort and filter, not the raw data order. */
export function indexColumn<T>(): ColumnDef<T> {
  return {
    id: "index",
    header: () => "No.",
    cell: ({ row, table }) => {
      const n =
        table.getPrePaginationRowModel().rows.findIndex((r) => r.id === row.id) +
        1;

      return <span className="db-idx">{String(n).padStart(2, "0")}</span>;
    },
  };
}

/** View / Edit links, plus an optional confirmed Delete. */
export function RowActions({
  viewHref,
  editHref,
  name,
  onDelete,
}: {
  viewHref: string;
  editHref: string;
  /** Needed with onDelete: shown in the confirm dialog. */
  name?: string;
  onDelete?: () => Promise<unknown>;
}) {
  return (
    <div className="db-acts">
      <Link href={viewHref} className="db-act">
        View
      </Link>
      <Link href={editHref} className="db-act">
        Edit
      </Link>
      {onDelete && (
        <ConfirmDelete name={name ?? "this entry"} onConfirm={onDelete} />
      )}
    </div>
  );
}

/** Live / Draft as a rotated stamp. */
export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span className="db-stamp" data-tone={published ? "live" : "quiet"}>
      {published ? "Live" : "Draft"}
    </span>
  );
}

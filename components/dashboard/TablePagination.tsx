import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TData = any;

type Props = {
  table: Table<TData>;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function TablePagination({ table }: Props) {
  const total = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="db-pager">
      <div className="db-pager_count">
        <strong>{pad2(total)}</strong>
        <span className="wk-label">
          {total === 1 ? "entry" : "entries"}
          {total > 0 && (
            <span className="text-[#b3b3b3]">
              {" "}
              / showing {from}–{to}
            </span>
          )}
        </span>
      </div>

      <div className="db-pager_ctrl">
        <select
          aria-label="Rows per page"
          className="db-select"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
        <button
          type="button"
          className="db-tile"
          aria-label="First page"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft />
        </button>
        <button
          type="button"
          className="db-tile"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </button>
        <span className="db-pager_page">
          {pad2(pageIndex + 1)} / {pad2(Math.max(table.getPageCount(), 1))}
        </span>
        <button
          type="button"
          className="db-tile"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </button>
        <button
          type="button"
          className="db-tile"
          aria-label="Last page"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}

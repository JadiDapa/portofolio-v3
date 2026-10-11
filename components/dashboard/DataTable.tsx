"use client";

import { ReactNode, useMemo, useState, useTransition } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import TablePagination from "./TablePagination";
import ConfirmDelete from "./ui/ConfirmDelete";
import { getErrorMessage } from "@/lib/utils";

/** Turns on the checkbox column and the floating "N selected" bar. Rows need a numeric `id`. */
export interface BulkActions {
  /** Plural noun for messages: "entries", "projects". */
  noun: string;
  publish?: (ids: number[], published: boolean) => Promise<unknown>;
  remove?: (ids: number[]) => Promise<unknown>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: (table: TableType<TData>) => ReactNode;
  /** Kept for API compatibility; the ledger has no filter-card title. */
  title?: string;
  /** Boolean column id to expose as All / on / off tabs (e.g. "published"). */
  statusColumn?: string;
  statusLabels?: { on: string; off: string };
  bulk?: BulkActions;
}

/** Tells the row which edge the cursor used, so the black wipe enters and leaves from it. */
function setOrigin(e: React.PointerEvent<HTMLTableRowElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty(
    "--origin",
    e.clientY < r.top + r.height / 2 ? "0%" : "100%",
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectColumn: ColumnDef<any, any> = {
  id: "select",
  header: ({ table }) => (
    <input
      type="checkbox"
      className="db-check"
      aria-label="Select all rows on this page"
      checked={table.getIsAllPageRowsSelected()}
      ref={(el) => {
        if (el) el.indeterminate = table.getIsSomePageRowsSelected();
      }}
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      className="db-check"
      aria-label="Select row"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(e.target.checked)}
    />
  ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable: React.FC<DataTableProps<any, any>> = ({
  columns,
  data,
  filters,
  statusColumn,
  statusLabels = { on: "Live", off: "Draft" },
  bulk,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pending, startTransition] = useTransition();

  const allColumns = useMemo(
    () => (bulk ? [selectColumn, ...columns] : columns),
    [bulk, columns],
  );

  const table = useReactTable({
    data,
    columns: allColumns,
    getRowId: (row) => String(row.id),
    enableRowSelection: !!bulk,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 10 } },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const statusCol = statusColumn ? table.getColumn(statusColumn) : undefined;
  const status = statusCol?.getFilterValue() as boolean | undefined;
  const all = table.getCoreRowModel().rows;
  const countOf = (v: boolean) =>
    all.filter((r) => r.getValue(statusColumn!) === v).length;

  // Only ids that still exist: a deleted row must not linger in the selection
  const selectedIds = all.filter((r) => rowSelection[r.id]).map((r) => Number(r.id));

  const tab = (label: string, value: boolean | undefined, count: number) => (
    <button
      type="button"
      aria-pressed={status === value}
      onClick={() => statusCol?.setFilterValue(value)}
    >
      {label} <sup>{String(count).padStart(2, "0")}</sup>
    </button>
  );

  function run(label: string, action: () => Promise<unknown>) {
    startTransition(async () => {
      try {
        await action();
        toast.success(label);
        table.resetRowSelection();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  const rows = table.getRowModel().rows;
  const n = selectedIds.length;

  return (
    <div className="w-full">
      {(filters || statusCol) && (
        <div className="db-bar">
          {statusCol && (
            <div className="db-tabs">
              {tab("All", undefined, all.length)}
              {tab(statusLabels.on, true, countOf(true))}
              {tab(statusLabels.off, false, countOf(false))}
            </div>
          )}
          {filters && <div className="db-bar_filters">{filters(table)}</div>}
        </div>
      )}

      <div className="db-tablewrap">
        <table className="db-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, i) => (
                <tr
                  key={row.id}
                  className="db-row"
                  data-selected={row.getIsSelected()}
                  style={{ "--i": i } as React.CSSProperties}
                  onPointerEnter={setOrigin}
                  onPointerLeave={setOrigin}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={allColumns.length} className="db-cell-sub">
                  <div className="py-10 text-center">
                    Nothing matches. Loosen a filter and try again.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />

      {bulk && (
        <div className="db-bulk" data-open={n > 0} role="region" aria-label="Bulk actions">
          <span className="db-bulk_count">
            <strong>{String(n).padStart(2, "0")}</strong> selected
          </span>

          <div className="db-bulk_ctrl">
            {bulk.publish && (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(`${n} ${bulk.noun} published`, () => bulk.publish!(selectedIds, true))
                  }
                >
                  Publish
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(`${n} ${bulk.noun} set to draft`, () => bulk.publish!(selectedIds, false))
                  }
                >
                  Unpublish
                </button>
              </>
            )}
            {bulk.remove && (
              <ConfirmDelete
                name={`${n} ${bulk.noun}`}
                title={`Delete ${n} ${n === 1 ? bulk.noun.replace(/ies$/, "y").replace(/s$/, "") : bulk.noun}?`}
                success={`${n} ${bulk.noun} deleted`}
                onConfirm={async () => {
                  await bulk.remove!(selectedIds);
                  table.resetRowSelection();
                }}
              >
                <button type="button" data-tone="danger" disabled={pending}>
                  Delete
                </button>
              </ConfirmDelete>
            )}
            <button type="button" onClick={() => table.resetRowSelection()}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

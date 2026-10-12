"use client";

import { ReactNode, useState, useTransition } from "react";
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
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
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

/**
 * Turns on a drag grip and ↑/↓ column. Rows need a numeric `id` and must arrive in
 * their saved order. Moves apply instantly and roll back if `onSave` fails.
 */
export interface ReorderOptions<TData> {
  /** Every id, top to bottom. */
  onSave: (ids: number[]) => Promise<unknown>;
  /** Rows only move within their group, e.g. featured projects stay above the rest. */
  groupOf?: (row: TData) => unknown;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reorder?: ReorderOptions<any>;
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
  reorder,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pending, startTransition] = useTransition();

  // Reorder works on a local copy so moves show instantly; fresh server data replaces it
  const [items, setItems] = useState(data);
  const [source, setSource] = useState(data);
  if (data !== source) {
    setSource(data);
    setItems(data);
  }
  const [moved, setMoved] = useState(false);
  const [armed, setArmed] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<{ id: number; after: boolean } | null>(null);

  // Positions only mean something in the saved order, so a sort or filter pauses reordering
  const canReorder = !!reorder && sorting.length === 0 && columnFilters.length === 0;

  /** The index range `row`'s group occupies (the whole list without `groupOf`). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupRange = (row: any) => {
    const groupOf = reorder?.groupOf;
    if (!groupOf) return [0, items.length - 1] as const;
    const g = groupOf(row);
    const lo = items.findIndex((r) => groupOf(r) === g);
    let hi = lo;
    while (hi + 1 < items.length && groupOf(items[hi + 1]) === g) hi++;
    return [lo, hi] as const;
  };

  function move(id: number, to: number) {
    const from = items.findIndex((r) => r.id === id);
    if (from < 0 || !reorder) return;
    const [lo, hi] = groupRange(items[from]);
    const target = Math.min(Math.max(to, lo), hi);
    if (target === from) return;

    const before = items;
    const next = [...items];
    next.splice(target, 0, ...next.splice(from, 1));
    setItems(next);
    setMoved(true);

    reorder
      .onSave(next.map((r) => r.id))
      .catch((err) => {
        setItems(before);
        toast.error(getErrorMessage(err, "Couldn't save the new order"));
      });
  }

  function endDrag() {
    setArmed(null);
    setDragging(null);
    setOver(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reorderColumn: ColumnDef<any, any> | null = reorder
    ? {
        id: "reorder",
        header: () => <span className="sr-only">Reorder</span>,
        cell: ({ row }) => {
          const id = row.original.id as number;
          const at = items.findIndex((r) => r.id === id);
          const [lo, hi] = groupRange(row.original);
          const hint = canReorder ? undefined : "Clear sorting and filters to reorder";

          return (
            <div className="db-move" title={hint}>
              <button
                type="button"
                className="db-move_grip"
                aria-label="Drag to reorder"
                disabled={!canReorder}
                onPointerDown={() => setArmed(id)}
                onPointerUp={() => setArmed(null)}
              >
                <GripVertical aria-hidden />
              </button>
              <div className="db-move_steps">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={!canReorder || at <= lo}
                  onClick={() => move(id, at - 1)}
                >
                  <ChevronUp aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={!canReorder || at >= hi}
                  onClick={() => move(id, at + 1)}
                >
                  <ChevronDown aria-hidden />
                </button>
              </div>
            </div>
          );
        },
      }
    : null;

  const allColumns = [
    ...(bulk ? [selectColumn] : []),
    ...(reorderColumn ? [reorderColumn] : []),
    ...columns,
  ];

  const table = useReactTable({
    data: reorder ? items : data,
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
        <table className="db-table" data-moved={moved || undefined}>
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
                  data-dragging={dragging === row.original.id || undefined}
                  data-drop={
                    over && over.id === row.original.id && dragging !== row.original.id
                      ? over.after
                        ? "after"
                        : "before"
                      : undefined
                  }
                  style={{ "--i": i } as React.CSSProperties}
                  onPointerEnter={setOrigin}
                  onPointerLeave={setOrigin}
                  // Only the grip arms a row for dragging, so text and links behave normally
                  draggable={canReorder && armed === row.original.id}
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", row.id);
                    setDragging(row.original.id);
                  }}
                  onDragOver={(e) => {
                    if (dragging === null) return;
                    e.preventDefault();
                    const r = e.currentTarget.getBoundingClientRect();
                    const after = e.clientY > r.top + r.height / 2;
                    if (!over || over.id !== row.original.id || over.after !== after) {
                      setOver({ id: row.original.id, after });
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragging !== null && over) {
                      const from = items.findIndex((r) => r.id === dragging);
                      let to = items.findIndex((r) => r.id === over.id) + (over.after ? 1 : 0);
                      if (from < to) to -= 1;
                      move(dragging, to);
                    }
                    endDrag();
                  }}
                  onDragEnd={endDrag}
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

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";

export interface ServiceTableType {
  id: number;
  title: string;
  slug: string;
  summary: string;
  order: number;
}

interface ServiceTableProps {
  services: ServiceTableType[];
}

export default function ServiceTable({ services }: ServiceTableProps) {
  return (
    <DataTable
      columns={serviceColumns}
      data={services}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-2 lg:gap-6">
          <SearchDataTable
            table={table}
            column="title"
            placeholder="Search Title..."
          />
        </div>
      )}
    />
  );
}

export const serviceColumns: ColumnDef<ServiceTableType>[] = [
  {
    id: "index",
    header: ({ column }) => <TableSorter isFirst column={column} header="#" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-fit ps-5 text-center text-xs">
        {row.index + 1}
      </div>
    ),
  },

  {
    accessorKey: "title",
    header: ({ column }) => <TableSorter column={column} header="TITLE" />,
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex flex-col leading-tight">
          <Link
            href={`/services/${service.slug}`}
            className="line-clamp-1 font-medium hover:underline"
          >
            {service.title}
          </Link>
          <span className="text-muted-foreground line-clamp-1 text-xs">
            {service.summary}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "order",
    header: ({ column }) => <TableSorter column={column} header="ORDER" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.order}
      </span>
    ),
  },

  {
    id: "actions",
    header: () => <span className="text-xs">ACTIONS</span>,
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            View
          </Link>

          <Link
            href={`/dashboard/services/update/${service.slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            Edit
          </Link>
        </div>
      );
    },
  },
];

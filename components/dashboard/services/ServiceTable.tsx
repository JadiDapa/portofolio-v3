"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import { RowActions, indexColumn } from "../table-columns";
import { deleteService, deleteServices } from "@/app/action/service.action";

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
      bulk={{ noun: "services", remove: deleteServices }}
      filters={(table) => (
        <SearchDataTable table={table} column="title" placeholder="Title" />
      )}
    />
  );
}

export const serviceColumns: ColumnDef<ServiceTableType>[] = [
  indexColumn<ServiceTableType>(),

  {
    accessorKey: "title",
    header: ({ column }) => <TableSorter column={column} header="Service" />,
    cell: ({ row }) => {
      const service = row.original;

      return (
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            href={`/dashboard/services/update/${service.slug}`}
            className="db-cell-title line-clamp-1"
          >
            {service.title}
          </Link>
          <span className="db-cell-sub line-clamp-1 max-w-lg">
            {service.summary}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "order",
    header: ({ column }) => <TableSorter column={column} header="Order" />,
    cell: ({ row }) => <span className="db-chip">#{row.original.order}</span>,
  },

  {
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <RowActions
        viewHref={`/services/${row.original.slug}`}
        editHref={`/dashboard/services/update/${row.original.slug}`}
        name={row.original.title}
        onDelete={() => deleteService(row.original.id)}
      />
    ),
  },
];

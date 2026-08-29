"use client";

import { useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import { Badge } from "@/components/ui/badge";
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

export default function InquiryTable({ inquiries }: InquiryTableProps) {
  return (
    <DataTable
      columns={inquiryColumns}
      data={inquiries}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-2 lg:gap-6">
          <SearchDataTable
            table={table}
            column="name"
            placeholder="Search Name..."
          />
          <SearchDataTable
            table={table}
            column="email"
            placeholder="Search Email..."
          />
        </div>
      )}
    />
  );
}

function InquiryActions({ inquiry }: { inquiry: InquiryTableType }) {
  const [isPending, startTransition] = useTransition();

  function toggleRead() {
    startTransition(async () => {
      try {
        await markInquiryRead(inquiry.id, !inquiry.read);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteInquiry(inquiry.id);
        toast.success("Inquiry deleted");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={toggleRead}
        className="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50"
      >
        {inquiry.read ? "Mark unread" : "Mark read"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={remove}
        className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

export const inquiryColumns: ColumnDef<InquiryTableType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <TableSorter column={column} header="NAME" />,
    cell: ({ row }) => {
      const inquiry = row.original;

      return (
        <div className="flex flex-col leading-tight">
          <span className="font-medium">{inquiry.name}</span>
          <span className="text-muted-foreground text-xs">{inquiry.email}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "message",
    header: () => <span className="text-xs">MESSAGE</span>,
    cell: ({ row }) => (
      <p className="text-muted-foreground line-clamp-2 max-w-xs text-sm">
        {row.original.message}
      </p>
    ),
  },

  {
    accessorKey: "projectTypes",
    header: () => <span className="text-xs">TYPE</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.projectTypes.length > 0
          ? row.original.projectTypes.join(", ")
          : "—"}
      </span>
    ),
  },

  {
    accessorKey: "budget",
    header: () => <span className="text-xs">BUDGET</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.budget || "—"}
      </span>
    ),
  },

  {
    accessorKey: "read",
    header: ({ column }) => <TableSorter column={column} header="STATUS" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.read
            ? "text-muted-foreground"
            : "border-primary/20 bg-primary/10 text-primary"
        }
      >
        {row.original.read ? "Read" : "New"}
      </Badge>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableSorter column={column} header="RECEIVED" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },

  {
    id: "actions",
    header: () => <span className="text-xs">ACTIONS</span>,
    cell: ({ row }) => <InquiryActions inquiry={row.original} />,
  },
];

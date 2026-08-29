"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import Image from "next/image";

export interface ProjectTableType {
  id: number;
  title: string;
  slug: string;
  client?: string | null;
  category: string;
  summary: string;
  coverImage?: string | null;
  year?: number | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
}

interface ProjectTableProps {
  projects: ProjectTableType[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <DataTable
      columns={projectColumns}
      data={projects}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-3 lg:gap-6">
          <SearchDataTable
            table={table}
            column="title"
            placeholder="Search Title..."
          />

          <SearchDataTable
            table={table}
            column="category"
            placeholder="Search Category..."
          />

          <SearchDataTable
            table={table}
            column="client"
            placeholder="Search Client..."
          />
        </div>
      )}
    />
  );
}

export const projectColumns: ColumnDef<ProjectTableType>[] = [
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
      const project = row.original;

      return (
        <div className="flex items-center gap-3">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              className="rounded-md object-cover"
              width={48}
              height={48}
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-md text-sm font-semibold">
              {project.title.charAt(0)}
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <Link
              href={`/work/${project.slug}`}
              className="line-clamp-1 font-medium hover:underline"
            >
              {project.title}
            </Link>

            <span className="text-muted-foreground line-clamp-1 text-xs">
              {project.summary}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => <TableSorter column={column} header="CATEGORY" />,
    cell: ({ row }) => (
      <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium">
        {row.original.category}
      </span>
    ),
  },

  {
    accessorKey: "client",
    header: ({ column }) => <TableSorter column={column} header="CLIENT" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.client || "—"}
      </span>
    ),
  },

  {
    accessorKey: "published",
    header: ({ column }) => <TableSorter column={column} header="STATUS" />,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              project.published
                ? "bg-green-500/10 text-green-600"
                : "bg-yellow-500/10 text-yellow-600"
            }`}
          >
            {project.published ? "PUBLISHED" : "DRAFT"}
          </span>
          {project.featured && (
            <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
              FEATURED
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="text-xs">ACTIONS</span>,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/work/${project.slug}`}
            className="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            View
          </Link>

          <Link
            href={`/dashboard/projects/update/${project.slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            Edit
          </Link>
        </div>
      );
    },
  },
];

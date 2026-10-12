"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import { PublishedBadge, RowActions, indexColumn } from "../table-columns";
import {
  deleteProject,
  deleteProjects,
  reorderProjects,
  setProjectsPublished,
} from "@/app/action/project.action";

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
  order: number;
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
      statusColumn="published"
      bulk={{ noun: "projects", publish: setProjectsPublished, remove: deleteProjects }}
      reorder={{
        onSave: reorderProjects,
        // Featured always sits above the rest, so rows only move within their group
        groupOf: (p: ProjectTableType) => p.featured,
      }}
      filters={(table) => (
        <>
          <SearchDataTable table={table} column="title" placeholder="Title" />
          <SearchDataTable
            table={table}
            column="category"
            placeholder="Category"
          />
          <SearchDataTable table={table} column="client" placeholder="Client" />
        </>
      )}
    />
  );
}

export const projectColumns: ColumnDef<ProjectTableType>[] = [
  indexColumn<ProjectTableType>(),

  {
    accessorKey: "title",
    header: ({ column }) => <TableSorter column={column} header="Project" />,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex items-center gap-4">
          <div className="db-thumb">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                width={56}
                height={56}
              />
            ) : (
              project.title.charAt(0)
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href={`/dashboard/projects/update/${project.slug}`}
              className="db-cell-title line-clamp-1"
            >
              {project.title}
            </Link>
            <span className="db-cell-sub line-clamp-1 max-w-md">
              {project.summary}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => <TableSorter column={column} header="Category" />,
    cell: ({ row }) => <span className="db-chip">{row.original.category}</span>,
  },

  {
    accessorKey: "client",
    header: ({ column }) => <TableSorter column={column} header="Client" />,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{row.original.client || "—"}</span>
        {row.original.year && (
          <span className="db-cell-sub">{row.original.year}</span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "published",
    header: ({ column }) => <TableSorter column={column} header="Status" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <PublishedBadge published={row.original.published} />
        {row.original.featured && (
          <span className="db-stamp" data-tone="alert">
            Featured
          </span>
        )}
      </div>
    ),
  },

  {
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <RowActions
        viewHref={`/work/${row.original.slug}`}
        editHref={`/dashboard/projects/update/${row.original.slug}`}
        name={row.original.title}
        onDelete={() => deleteProject(row.original.id)}
      />
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import Image from "next/image";

export interface PostTableType {
  id: number;
  title: string;
  slug: string;
  content?: string | null;
  thumbnail?: string | null;
  published: boolean;
  createdAt: Date;
  author: {
    id: number;
    username: string;
    name?: string | null;
    role: "USER" | "ADMIN";
  };
}

interface PostTableProps {
  posts: PostTableType[];
}

export default function PostTable({ posts }: PostTableProps) {
  return (
    <DataTable
      columns={postColumns}
      data={posts}
      filters={(table) => (
        <div className="grid w-full items-end gap-4 p-4 lg:grid-cols-3 lg:gap-6">
          <SearchDataTable
            table={table}
            column="title"
            placeholder="Search Title..."
          />

          <SearchDataTable
            table={table}
            column="author"
            placeholder="Search Author..."
          />

          <SearchDataTable
            table={table}
            column="slug"
            placeholder="Search Slug..."
          />
        </div>
      )}
    />
  );
}

export const postColumns: ColumnDef<PostTableType>[] = [
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
      const post = row.original;

      return (
        <div className="flex items-center gap-3">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              className="rounded-md object-cover"
              width={48}
              height={48}
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-md text-sm font-semibold">
              {post.title.charAt(0)}
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <Link
              href={`/posts/${post.slug}`}
              className="line-clamp-1 font-medium hover:underline"
            >
              {post.title}
            </Link>

            <span className="text-muted-foreground line-clamp-1 text-xs">
              {post.content || "No content"}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "author",
    accessorFn: (row) => `${row.author.name || ""} ${row.author.username}`,
    header: ({ column }) => <TableSorter column={column} header="AUTHOR" />,
    cell: ({ row }) => {
      const author = row.original.author;

      return (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {(author.name || author.username).charAt(0)}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-medium">{author.name || "Unnamed User"}</span>

            <span className="text-muted-foreground text-xs">
              @{author.username}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "slug",
    header: ({ column }) => <TableSorter column={column} header="SLUG" />,
    cell: ({ row }) => (
      <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium">
        {row.original.slug}
      </span>
    ),
  },

  {
    accessorKey: "published",
    header: ({ column }) => <TableSorter column={column} header="STATUS" />,
    cell: ({ row }) => {
      const published = row.original.published;

      return (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            published
              ? "bg-green-500/10 text-green-600"
              : "bg-yellow-500/10 text-yellow-600"
          }`}
        >
          {published ? "PUBLISHED" : "DRAFT"}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableSorter column={column} header="CREATED" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return (
        <div className="flex flex-col text-sm leading-tight">
          <span>{date.toLocaleDateString()}</span>

          <span className="text-muted-foreground text-xs">
            {date.toLocaleTimeString()}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <span className="text-xs">ACTIONS</span>,
    cell: ({ row }) => {
      const post = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/journal/${post.slug}`}
            className="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            View
          </Link>

          <Link
            href={`/dashboard/posts/update/${post.slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          >
            Edit
          </Link>
        </div>
      );
    },
  },
];

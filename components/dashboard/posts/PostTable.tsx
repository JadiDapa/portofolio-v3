"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";

import DataTable from "../DataTable";
import SearchDataTable from "../SearchDataTable";
import TableSorter from "../TableSorter";
import { PublishedBadge, RowActions, indexColumn } from "../table-columns";
import { deletePost, deletePosts, setPostsPublished } from "@/app/action/post.action";

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
      statusColumn="published"
      bulk={{ noun: "entries", publish: setPostsPublished, remove: deletePosts }}
      filters={(table) => (
        <>
          <SearchDataTable table={table} column="title" placeholder="Title" />
          <SearchDataTable table={table} column="author" placeholder="Author" />
          <SearchDataTable table={table} column="slug" placeholder="Slug" />
        </>
      )}
    />
  );
}

export const postColumns: ColumnDef<PostTableType>[] = [
  indexColumn<PostTableType>(),

  {
    accessorKey: "title",
    header: ({ column }) => <TableSorter column={column} header="Entry" />,
    cell: ({ row }) => {
      const post = row.original;

      return (
        <div className="flex items-center gap-4">
          <div className="db-thumb">
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={56}
                height={56}
              />
            ) : (
              post.title.charAt(0)
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <Link
              href={`/dashboard/posts/update/${post.slug}`}
              className="db-cell-title line-clamp-1"
            >
              {post.title}
            </Link>
            <span className="db-cell-sub line-clamp-1 max-w-md">
              {post.content || "No content yet"}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "author",
    accessorFn: (row) => `${row.author.name || ""} ${row.author.username}`,
    header: ({ column }) => <TableSorter column={column} header="Author" />,
    cell: ({ row }) => {
      const author = row.original.author;

      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{author.name || "Unnamed"}</span>
          <span className="db-cell-sub">@{author.username}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "slug",
    header: ({ column }) => <TableSorter column={column} header="Slug" />,
    cell: ({ row }) => <span className="db-chip">{row.original.slug}</span>,
  },

  {
    accessorKey: "published",
    header: ({ column }) => <TableSorter column={column} header="Status" />,
    cell: ({ row }) => <PublishedBadge published={row.original.published} />,
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <TableSorter column={column} header="Written" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="db-cell-sub">
            {date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => "Actions",
    cell: ({ row }) => (
      <RowActions
        viewHref={`/journal/${row.original.slug}`}
        editHref={`/dashboard/posts/update/${row.original.slug}`}
        name={row.original.title}
        onDelete={() => deletePost(row.original.id)}
      />
    ),
  },
];

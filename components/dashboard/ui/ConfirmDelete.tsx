"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GridButton from "@/components/root/work/GridButton";
import { getErrorMessage } from "@/lib/utils";

type Props = {
  /** What is being deleted, shown in the dialog: "Fintech Dashboard". */
  name: string;
  onConfirm: () => Promise<unknown>;
  success?: string;
  /** Overrides the heading, e.g. "Delete 3 entries?". */
  title?: string;
  /** Replaces the default underlined "Delete" trigger. */
  children?: React.ReactNode;
};

/** Every delete in the dashboard goes through here: ask, run, toast. */
export default function ConfirmDelete({
  name,
  onConfirm,
  success = "Deleted",
  title,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      try {
        await onConfirm();
        toast.success(success);
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children ?? (
          <button type="button" className="db-act" data-tone="danger">
            Delete
          </button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="db-confirm">
        <span className="wk-label text-[#b3b3b3]">(!) Cannot be undone</span>
        <AlertDialogTitle>{title ?? `Delete “${name}”?`}</AlertDialogTitle>
        <AlertDialogDescription>
          This removes it from the database and from the public site.
        </AlertDialogDescription>
        <div className="flex flex-wrap gap-4 pt-2">
          <GridButton onClick={() => setOpen(false)}>Keep it</GridButton>
          <GridButton dark disabled={pending} onClick={run}>
            {pending ? "Deleting…" : "Delete forever"}
          </GridButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Reorder, useDragControls } from "motion/react";
import { GripVertical, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DbButton from "./DbButton";
import { getErrorMessage } from "@/lib/utils";

export type ReorderItem = { id: number; title: string; sub?: string };

type Props = {
  items: ReorderItem[];
  /** Receives the ids in their new order. */
  onSave: (ids: number[]) => Promise<unknown>;
  title: string;
  description: string;
};

/** A row you can only drag by its grip, so text stays selectable. */
function Row({ item, index }: { item: ReorderItem; index: number }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className="db-reorder_row"
      whileDrag={{ scale: 1.02, boxShadow: "0.5rem -0.5rem 0 #0f0f0f", zIndex: 5 }}
    >
      <span
        role="button"
        aria-label={`Drag ${item.title}`}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: "none" }}
        className="db-reorder_grip"
      >
        <GripVertical size={18} strokeWidth={1.4} />
      </span>
      <span className="db-idx db-reorder_num">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="db-cell-title block truncate">{item.title}</span>
        {item.sub && <span className="db-cell-sub block truncate">{item.sub}</span>}
      </span>
    </Reorder.Item>
  );
}

export default function ReorderSheet({ items, onSave, title, description }: Props) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(items);
  const [pending, startTransition] = useTransition();

  const changed = list.some((item, i) => item.id !== items[i]?.id);

  function save() {
    startTransition(async () => {
      try {
        await onSave(list.map((i) => i.id));
        toast.success("Order saved");
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        // Start from the saved order every time it opens
        if (next) setList(items);
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>
        <DbButton>Reorder</DbButton>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="db-dialog db-sheetpanel">
        <SheetHeader>
          <SheetClose className="db-sheet_close" aria-label="Close">
            <X size={18} strokeWidth={1.4} />
          </SheetClose>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="db-sheet_body">
          <Reorder.Group axis="y" values={list} onReorder={setList} className="db-reorder">
            {list.map((item, i) => (
              <Row key={item.id} item={item} index={i} />
            ))}
          </Reorder.Group>
        </div>

        <div className="db-sheetfoot db-sheetfoot--flush">
          <button type="button" className="db-act" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <DbButton dark disabled={!changed || pending} onClick={save}>
            {pending ? "Saving…" : "Save order"}
          </DbButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}

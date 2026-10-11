"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DbButton from "@/components/dashboard/ui/DbButton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import EditIconButton from "@/components/dashboard/EditIconButton";
import { SwitchField, TextField } from "@/components/dashboard/form-fields";
import { getErrorMessage } from "@/lib/utils";
import { CreateRecognitionSchema } from "@/servers/validators/recognition.validator";
import {
  createRecognition,
  deleteRecognition,
  updateRecognition,
} from "@/app/action/recognition.action";
import { Recognition } from "@/generated/prisma";

type RecognitionFormType = z.input<typeof CreateRecognitionSchema>;

const KINDS = [
  { value: "AWARD", label: "Award" },
  { value: "PRESS", label: "Press" },
  { value: "CERTIFICATION", label: "Certification" },
  { value: "COMPETITION", label: "Competition" },
] as const;

function toDefaults(recognition?: Recognition): RecognitionFormType {
  return {
    source: recognition?.source ?? "",
    kind: recognition?.kind ?? "AWARD",
    title: recognition?.title ?? "",
    url: recognition?.url ?? "",
    year: recognition?.year ?? "",
    order: recognition?.order ?? 0,
    published: recognition?.published ?? true,
  };
}

/** Create dialog when `recognition` is omitted, edit dialog otherwise. */
export default function RecognitionSheet({
  recognition,
}: {
  recognition?: Recognition;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editing = !!recognition;

  const form = useForm<RecognitionFormType>({
    resolver: zodResolver(CreateRecognitionSchema),
    defaultValues: toDefaults(recognition),
  });

  function onOpenChange(next: boolean) {
    // Drop unsaved edits from a previous open
    if (next) form.reset(toDefaults(recognition));
    setOpen(next);
  }

  function onSubmit(values: RecognitionFormType) {
    startTransition(async () => {
      try {
        if (recognition) {
          await updateRecognition(recognition.id, values);
          toast.success("Recognition updated!");
        } else {
          await createRecognition(values);
          toast.success("Recognition created!");
        }
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  function onDelete() {
    if (!recognition) return;
    startTransition(async () => {
      try {
        await deleteRecognition(recognition.id);
        toast.success("Recognition deleted");
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {editing ? (
          <EditIconButton aria-label="Edit recognition" />
        ) : (
          <DbButton>Add Recognition</DbButton>
        )}
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="db-dialog db-sheetpanel" aria-describedby={undefined}>
        <SheetHeader>
          <SheetClose className="db-sheet_close" aria-label="Close">
            <X size={18} strokeWidth={1.4} />
          </SheetClose>
          <SheetTitle>{editing ? "Edit Recognition" : "Add Recognition"}</SheetTitle>
          {!editing && (
            <p className="text-muted-foreground text-sm">
              An award, certification, competition result or press mention.
            </p>
          )}
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField control={form.control} name="source" label="Source" placeholder="Dicoding" />

            <Controller
              name="kind"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {KINDS.map((k) => (
                        <SelectItem key={k.value} value={k.value}>
                          {k.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <TextField
            control={form.control}
            name="title"
            label="Title"
            placeholder="1st Place — Project name"
          />

          <TextField control={form.control} name="url" label="Link" placeholder="https://" />

          <div className="grid grid-cols-2 gap-4">
            <TextField control={form.control} name="year" label="Year" type="number" placeholder="2025" />
            <TextField control={form.control} name="order" label="Order" type="number" />
          </div>

          <SwitchField control={form.control} name="published" label="Published" />

          <SheetFooter className="db-sheetfoot">
            {editing && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={onDelete}
                disabled={isPending}
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : editing ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

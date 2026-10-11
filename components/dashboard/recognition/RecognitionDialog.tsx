"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

/** Create dialog when `recognition` is omitted, edit dialog otherwise. */
export default function RecognitionDialog({
  recognition,
}: {
  recognition?: Recognition;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editing = !!recognition;

  const form = useForm<RecognitionFormType>({
    resolver: zodResolver(CreateRecognitionSchema),
    defaultValues: {
      source: recognition?.source ?? "",
      kind: recognition?.kind ?? "AWARD",
      title: recognition?.title ?? "",
      url: recognition?.url ?? "",
      year: recognition?.year ?? "",
      order: recognition?.order ?? 0,
      published: recognition?.published ?? true,
    },
  });

  function onSubmit(values: RecognitionFormType) {
    startTransition(async () => {
      try {
        if (recognition) {
          await updateRecognition(recognition.id, values);
          toast.success("Recognition updated!");
        } else {
          await createRecognition(values);
          toast.success("Recognition created!");
          form.reset();
        }
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
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
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editing ? (
          <button
            aria-label="Edit recognition"
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
          >
            <Pencil className="size-4" />
          </button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Add Recognition
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Recognition" : "Add Recognition"}</DialogTitle>
          {!editing && (
            <p className="text-muted-foreground text-sm">
              An award, certification, competition result or press mention.
            </p>
          )}
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="source"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" {...field} placeholder="Dicoding" />
                  {fieldState.error && (
                    <p className="text-destructive text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

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

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...field}
                  placeholder="1st Place — Project name"
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="url">Link</Label>
                <Input
                  id="url"
                  {...field}
                  value={field.value ?? ""}
                  placeholder="https://"
                />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="year"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    {...field}
                    value={(field.value as number | string | undefined) ?? ""}
                    placeholder="2025"
                  />
                </div>
              )}
            />

            <Controller
              name="order"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    {...field}
                    value={(field.value as number | string | undefined) ?? 0}
                  />
                </div>
              )}
            />
          </div>

          <Controller
            name="published"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            )}
          />

          <DialogFooter className="pt-2">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

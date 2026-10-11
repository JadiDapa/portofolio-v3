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
import { Button } from "@/components/ui/button";
import DbButton from "@/components/dashboard/ui/DbButton";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import EditIconButton from "@/components/dashboard/EditIconButton";
import {
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import LogoField from "./LogoField";
import { CreateTestimonialSchema } from "@/servers/validators/testimonial.validator";
import { createTestimonial, updateTestimonial } from "@/app/action/testimonial.action";
import { getErrorMessage } from "@/lib/utils";
import { Testimonial } from "@/generated/prisma";

type TestimonialFormType = z.input<typeof CreateTestimonialSchema>;

function toDefaults(testimonial?: Testimonial): TestimonialFormType {
  return {
    quote: testimonial?.quote ?? "",
    authorName: testimonial?.authorName ?? "",
    authorTitle: testimonial?.authorTitle ?? "",
    company: testimonial?.company ?? "",
    logo: testimonial?.logo ?? "",
    published: testimonial?.published ?? true,
  };
}

/** Create dialog when `testimonial` is omitted, edit dialog otherwise. */
export default function TestimonialSheet({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editing = !!testimonial;

  const form = useForm<TestimonialFormType>({
    resolver: zodResolver(CreateTestimonialSchema),
    defaultValues: toDefaults(testimonial),
  });

  function onOpenChange(next: boolean) {
    // Drop unsaved edits from a previous open
    if (next) form.reset(toDefaults(testimonial));
    setOpen(next);
  }

  function onSubmit(values: TestimonialFormType) {
    startTransition(async () => {
      try {
        if (testimonial) {
          await updateTestimonial(testimonial.id, values);
          toast.success("Testimonial updated!");
        } else {
          await createTestimonial(values);
          toast.success("Testimonial created!");
        }
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
          <EditIconButton aria-label="Edit testimonial" />
        ) : (
          <DbButton>Add Testimonial</DbButton>
        )}
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="db-dialog db-sheetpanel" aria-describedby={undefined}>
        <SheetHeader>
          <SheetClose className="db-sheet_close" aria-label="Close">
            <X size={18} strokeWidth={1.4} />
          </SheetClose>
          <SheetTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</SheetTitle>
          {!editing && (
            <p className="text-muted-foreground text-sm">
              Add a client quote to show on the site.
            </p>
          )}
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <TextAreaField
            control={form.control}
            name="quote"
            label="Quote"
            placeholder="What did the client say?"
            rows="min-h-24"
          />

          <TextField
            control={form.control}
            name="authorName"
            label="Author name"
            placeholder="Jane Doe"
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField control={form.control} name="authorTitle" label="Title" placeholder="CEO" />
            <TextField
              control={form.control}
              name="company"
              label="Company"
              placeholder="Acme Inc."
            />
          </div>

          <Controller
            name="logo"
            control={form.control}
            render={({ field }) => (
              <LogoField value={field.value} onChange={field.onChange} />
            )}
          />

          <SwitchField control={form.control} name="published" label="Published" />

          <SheetFooter className="db-sheetfoot">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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

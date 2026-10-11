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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import LogoField from "./LogoField";
import { UpdateTestimonialSchema } from "@/servers/validators/testimonial.validator";
import { updateTestimonial } from "@/app/action/testimonial.action";
import { Testimonial } from "@/generated/prisma";

type TestimonialFormType = z.infer<typeof UpdateTestimonialSchema>;

export default function EditTestimonialDialog({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TestimonialFormType>({
    resolver: zodResolver(UpdateTestimonialSchema),
    defaultValues: {
      quote: testimonial.quote,
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle ?? "",
      company: testimonial.company ?? "",
      logo: testimonial.logo ?? "",
      published: testimonial.published,
    },
  });

  async function onSubmit(values: TestimonialFormType) {
    startTransition(async () => {
      try {
        await updateTestimonial(testimonial.id, values);
        toast.success("Testimonial updated!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Edit testimonial"
          className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
        >
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <Controller
            name="quote"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="quote">Quote</Label>
                <Textarea
                  id="quote"
                  {...field}
                  className="min-h-24 resize-y"
                />
              </div>
            )}
          />

          <Controller
            name="authorName"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="authorName">Author name</Label>
                <Input id="authorName" {...field} />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="authorTitle"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="authorTitle">Title</Label>
                  <Input id="authorTitle" {...field} value={field.value ?? ""} />
                </div>
              )}
            />

            <Controller
              name="company"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...field} value={field.value ?? ""} />
                </div>
              )}
            />
          </div>

          <Controller
            name="logo"
            control={form.control}
            render={({ field }) => (
              <LogoField value={field.value} onChange={field.onChange} />
            )}
          />

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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

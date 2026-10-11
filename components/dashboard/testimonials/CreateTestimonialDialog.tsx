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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import LogoField from "./LogoField";
import { CreateTestimonialSchema } from "@/servers/validators/testimonial.validator";
import { createTestimonial } from "@/app/action/testimonial.action";

type TestimonialFormType = z.input<typeof CreateTestimonialSchema>;

export default function CreateTestimonialDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TestimonialFormType>({
    resolver: zodResolver(CreateTestimonialSchema),
    defaultValues: {
      quote: "",
      authorName: "",
      authorTitle: "",
      company: "",
      logo: "",
      published: true,
    },
  });

  async function onSubmit(values: TestimonialFormType) {
    startTransition(async () => {
      try {
        await createTestimonial(values);
        toast.success("Testimonial created!");
        form.reset();
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Add a client quote to show on the site.
          </p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <Controller
            name="quote"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="quote">Quote</Label>
                <Textarea
                  id="quote"
                  {...field}
                  placeholder="What did the client say?"
                  className="min-h-24 resize-y"
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
            name="authorName"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="authorName">Author name</Label>
                <Input id="authorName" {...field} placeholder="Jane Doe" />
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
              name="authorTitle"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="authorTitle">Title</Label>
                  <Input id="authorTitle" {...field} placeholder="CEO" />
                </div>
              )}
            />

            <Controller
              name="company"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...field} placeholder="Acme Inc." />
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

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

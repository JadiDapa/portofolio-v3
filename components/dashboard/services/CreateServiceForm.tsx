"use client";

import { useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FaqEditor, ProcessEditor, cleanFaqs, cleanProcess } from "@/components/dashboard/services/ServiceContentEditors";
import { MediaSlot } from "@/components/dashboard/projects/GalleryEditor";
import { CreateServiceSchema } from "@/servers/validators/service.validator";
import { createService } from "@/app/action/service.action";

type ServiceFormType = z.input<typeof CreateServiceSchema>;

export default function CreateServiceForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ServiceFormType>({
    resolver: zodResolver(CreateServiceSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      description: "",
      headline: "",
      lead: "",
      process: [],
      faqs: [],
      media: null,
      order: 0,
    },
  });

  async function onSubmit(values: ServiceFormType) {
    startTransition(async () => {
      try {
        await createService({
          ...values,
          process: cleanProcess(values.process),
          faqs: cleanFaqs(values.faqs),
          slug: slugify(values.title, { lower: true, strict: true }),
        });
        toast.success("Service created!");
        router.push("/dashboard/services");
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...field} placeholder="e.g. Branding" />
            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="headline"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="headline">Page headline</Label>
            <p className="text-muted-foreground text-sm">
              Big heading in the intro. Wrap one word in *asterisks* to extrude it.
            </p>
            <Input
              id="headline"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="e.g. Built to *load* fast and last long"
            />
          </div>
        )}
      />

      <Controller
        name="lead"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="lead">Lead sentence</Label>
            <Textarea
              id="lead"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Larger text beside the description"
              className="min-h-20 resize-y"
            />
          </div>
        )}
      />

      <Controller
        name="summary"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...field}
              placeholder="Short blurb shown on the services grid"
              className="min-h-20 resize-y"
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
        name="description"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...field}
              placeholder="Long-form detail shown on the service page"
              className="min-h-48 resize-y"
            />
          </div>
        )}
      />

      <Controller
        name="process"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>How it works</Label>
            <p className="text-muted-foreground text-sm">
              Numbered steps shown on the service page.
            </p>
            <ProcessEditor value={field.value ?? []} onChange={field.onChange} />
          </div>
        )}
      />

      <Controller
        name="faqs"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>Common questions</Label>
            <p className="text-muted-foreground text-sm">
              The first one opens by default.
            </p>
            <FaqEditor value={field.value ?? []} onChange={field.onChange} />
          </div>
        )}
      />

      <Controller
        name="media"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>Hover media</Label>
            <p className="text-muted-foreground text-sm">
              Slides in on the /services list when the row is hovered.
            </p>
            <MediaSlot
              value={field.value}
              onChange={field.onChange}
              label="image or video (mp4/webm, up to 50MB)"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
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
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </div>
        )}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : "Create Service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

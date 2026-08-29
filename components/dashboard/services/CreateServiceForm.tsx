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
      order: 0,
    },
  });

  async function onSubmit(values: ServiceFormType) {
    startTransition(async () => {
      try {
        await createService({
          ...values,
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

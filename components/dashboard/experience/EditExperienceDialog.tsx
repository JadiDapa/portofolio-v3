"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { UpdateExperienceSchema } from "@/servers/validators/experience.validator";
import { updateExperience } from "@/app/action/experience.action";
import { Experience } from "@/generated/prisma";

type ExperienceFormType = z.input<typeof UpdateExperienceSchema>;

export default function EditExperienceDialog({
  experience,
}: {
  experience: Experience;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState(!experience.endDate);

  const form = useForm<ExperienceFormType>({
    resolver: zodResolver(UpdateExperienceSchema),
    defaultValues: {
      type: experience.type,
      organization: experience.organization,
      role: experience.role,
      description: experience.description ?? "",
      startDate: experience.startDate,
      endDate: experience.endDate,
      order: experience.order,
    },
  });

  const type = useWatch({ control: form.control, name: "type" });

  async function onSubmit(values: ExperienceFormType) {
    startTransition(async () => {
      try {
        await updateExperience(experience.id, {
          ...values,
          endDate: current ? null : values.endDate,
        });
        toast.success("Experience updated!");
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
          aria-label="Edit experience"
          className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
        >
          <Pencil className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <Controller
            name="type"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORK">Work</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            name="organization"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="organization">
                  {type === "EDUCATION" ? "School" : "Company"}
                </Label>
                <Input id="organization" {...field} />
              </div>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="role">
                  {type === "EDUCATION" ? "Degree" : "Role"}
                </Label>
                <Input id="role" {...field} />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value as string).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    disabled={current}
                    value={
                      field.value
                        ? new Date(field.value as string).toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="current" checked={current} onCheckedChange={setCurrent} />
            <Label htmlFor="current">
              {type === "EDUCATION" ? "Currently studying here" : "Currently working here"}
            </Label>
          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...field}
                  value={field.value ?? ""}
                  className="min-h-20 resize-y"
                />
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

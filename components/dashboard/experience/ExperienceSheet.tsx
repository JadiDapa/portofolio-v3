"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import TagInput from "@/components/dashboard/ui/TagInput";
import EditIconButton from "@/components/dashboard/EditIconButton";
import { TextAreaField, TextField } from "@/components/dashboard/form-fields";
import { CreateExperienceSchema } from "@/servers/validators/experience.validator";
import { createExperience, updateExperience } from "@/app/action/experience.action";
import { getErrorMessage } from "@/lib/utils";
import { Experience } from "@/generated/prisma";

type ExperienceFormType = z.input<typeof CreateExperienceSchema>;

function toDefaults(experience?: Experience): ExperienceFormType {
  return {
    type: experience?.type ?? "WORK",
    organization: experience?.organization ?? "",
    role: experience?.role ?? "",
    description: experience?.description ?? "",
    highlights: experience?.highlights ?? [],
    tools: experience?.tools ?? [],
    startDate: experience ? experience.startDate.toISOString().slice(0, 10) : "",
    endDate: experience?.endDate ? experience.endDate.toISOString().slice(0, 10) : "",
    order: experience?.order ?? 0,
  };
}

/** Create dialog when `experience` is omitted, edit dialog otherwise. */
export default function ExperienceSheet({
  experience,
}: {
  experience?: Experience;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [current, setCurrent] = useState(!!experience && !experience.endDate);
  const editing = !!experience;

  const form = useForm<ExperienceFormType>({
    resolver: zodResolver(CreateExperienceSchema),
    defaultValues: toDefaults(experience),
  });

  const type = useWatch({ control: form.control, name: "type" });

  function onOpenChange(next: boolean) {
    // Drop unsaved edits from a previous open
    if (next) {
      form.reset(toDefaults(experience));
      setCurrent(!!experience && !experience.endDate);
    }
    setOpen(next);
  }

  function onCurrentChange(next: boolean) {
    setCurrent(next);
    if (next) form.setValue("endDate", "");
  }

  function onSubmit(values: ExperienceFormType) {
    startTransition(async () => {
      try {
        const data = {
          ...values,
          highlights: (values.highlights ?? []).map((h) => h.trim()).filter(Boolean),
          endDate: current ? null : values.endDate,
        };
        if (experience) {
          await updateExperience(experience.id, data);
          toast.success("Experience updated!");
        } else {
          await createExperience(data);
          toast.success("Experience added!");
        }
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  const education = type === "EDUCATION";
  const organization = type === "ORGANIZATION";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {editing ? (
          <EditIconButton aria-label="Edit experience" />
        ) : (
          <DbButton>Add Experience</DbButton>
        )}
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="db-dialog db-sheetpanel" aria-describedby={undefined}>
        <SheetHeader>
          <SheetClose className="db-sheet_close" aria-label="Close">
            <X size={18} strokeWidth={1.4} />
          </SheetClose>
          <SheetTitle>{editing ? "Edit Experience" : "Add Experience"}</SheetTitle>
          {!editing && (
            <p className="text-muted-foreground text-sm">
              Add a work or education entry to your timeline.
            </p>
          )}
        </SheetHeader>
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
                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <TextField
            control={form.control}
            name="organization"
            label={education ? "School" : organization ? "Organization" : "Company"}
            placeholder={
              education ? "University name" : organization ? "Club, community or NGO" : "Company name"
            }
          />

          <TextField
            control={form.control}
            name="role"
            label={education ? "Degree" : organization ? "Position" : "Role"}
            placeholder={
              education
                ? "e.g. B.Eng Electrical Engineering"
                : organization
                  ? "e.g. Head of Technical Division"
                  : "e.g. Software Engineer"
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField control={form.control} name="startDate" label="Start date" type="date" />
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
                    value={(field.value as string | null | undefined) ?? ""}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="current" checked={current} onCheckedChange={onCurrentChange} />
            <Label htmlFor="current">
              {education
                ? "Currently studying here"
                : organization
                  ? "Currently active here"
                  : "Currently working here"}
            </Label>
          </div>

          <TextAreaField
            control={form.control}
            name="description"
            label="Description (optional)"
            placeholder="A short note about this role or programme"
          />

          <Controller
            name="highlights"
            control={form.control}
            render={({ field }) => (
              <div className="db-field">
                <label htmlFor="highlights" className="db-label">
                  Highlights
                </label>
                <p className="db-field_hint">One achievement per line.</p>
                <textarea
                  id="highlights"
                  className="db-input min-h-24 resize-y"
                  placeholder={"Led a team of 4\nCut report time by 60%"}
                  value={(field.value ?? []).join("\n")}
                  onChange={(e) => field.onChange(e.target.value.split("\n"))}
                  onBlur={() =>
                    field.onChange((field.value ?? []).map((h) => h.trim()).filter(Boolean))
                  }
                />
              </div>
            )}
          />

          <Controller
            name="tools"
            control={form.control}
            render={({ field }) => (
              <div className="db-field">
                <label htmlFor="tools" className="db-label">
                  Tools used
                </label>
                <TagInput
                  id="tools"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder="Next.js, Go, PLC…"
                  label="tool"
                />
              </div>
            )}
          />

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

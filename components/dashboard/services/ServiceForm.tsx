"use client";

import { useTransition } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  NumberField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import EditorShell from "@/components/dashboard/ui/EditorShell";
import DraftBanner from "@/components/dashboard/ui/DraftBanner";
import { useFormDraft } from "@/components/dashboard/ui/useFormDraft";
import FormSection from "@/components/dashboard/ui/FormSection";
import ServiceLivePreview from "@/components/dashboard/services/ServiceLivePreview";
import { FaqEditor, ProcessEditor, SkillsEditor, newSkillId } from "@/components/dashboard/services/ServiceContentEditors";
import { MediaSlot } from "@/components/dashboard/projects/GalleryEditor";
import {
  CreateServiceSchema,
  FaqSchema,
  ProcessStepSchema,
  SkillSchema,
  cleanFaqs,
  cleanProcess,
  cleanSkills,
  parseList,
  type Faq,
  type ProcessStep,
  type Skill,
} from "@/servers/validators/service.validator";
import { createService, updateService } from "@/app/action/service.action";
import { getErrorMessage } from "@/lib/utils";
import { Service } from "@/generated/prisma";

type ServiceFormType = z.input<typeof CreateServiceSchema>;

/** Create form when `service` is omitted, edit form otherwise. */
export default function ServiceForm({ service }: { service?: Service }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ServiceFormType>({
    resolver: zodResolver(CreateServiceSchema),
    defaultValues: {
      title: service?.title ?? "",
      summary: service?.summary ?? "",
      description: service?.description ?? "",
      headline: service?.headline ?? "",
      lead: service?.lead ?? "",
      process: parseList(ProcessStepSchema, service?.process),
      faqs: parseList(FaqSchema, service?.faqs),
      skills: parseList(SkillSchema, service?.skills).map((k) => ({ ...k, id: k.id ?? newSkillId() })),
      media: service?.media ?? null,
      order: service?.order ?? 0,
    },
  });

  const draftKey = `db-draft:service:${service?.id ?? "new"}`;
  const clearDraft = useFormDraft(form, draftKey);
  const watched = useWatch({ control: form.control });

  function onSubmit(values: ServiceFormType) {
    startTransition(async () => {
      try {
        const data = {
          ...values,
          process: cleanProcess(values.process),
          faqs: cleanFaqs(values.faqs),
          skills: cleanSkills(values.skills),
        };
        if (service) {
          await updateService(service.id, data);
          toast.success("Service updated!");
        } else {
          await createService(data);
          toast.success("Service created!");
        }
        clearDraft();
        router.push("/dashboard/services");
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  return (
    <EditorShell
      banner={<DraftBanner storageKey={draftKey} form={form} />}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={isPending}
      dirty={form.formState.isDirty}
      submitLabel={service ? "Save changes" : "Create service"}
      cancelHref="/dashboard/services"
      preview={
        <ServiceLivePreview
          values={{
            title: watched.title,
            summary: watched.summary,
            description: watched.description,
            headline: watched.headline,
            lead: watched.lead,
            process: watched.process as ProcessStep[] | undefined,
            faqs: watched.faqs as Faq[] | undefined,
            skills: watched.skills as Skill[] | undefined,
          }}
        />
      }
    >
      <FormSection num={1} title="Basics">
        <TextField control={form.control} name="title" label="Title" placeholder="e.g. Branding" />
        <TextAreaField
          control={form.control}
          name="summary"
          label="Summary"
          placeholder="Short blurb shown on the services grid"
        />
        <NumberField control={form.control} name="order" label="Order" />
      </FormSection>

      <FormSection num={2} title="Page intro">
        <TextField
          control={form.control}
          name="headline"
          label="Page headline"
          hint="Big heading in the intro. Wrap one word in *asterisks* to extrude it."
          placeholder="e.g. Built to *load* fast and last long"
        />
        <TextAreaField
          control={form.control}
          name="lead"
          label="Lead sentence"
          placeholder="Larger text beside the description"
        />
        <TextAreaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Long-form detail shown on the service page"
          rows="min-h-48"
        />
      </FormSection>

      <FormSection num={3} title="Skills & tools">
        <p className="db-field_hint">
          Service → skills → tools. Shown on the service page and in the About toolbox.
        </p>
        <Controller
          name="skills"
          control={form.control}
          render={({ field }) => (
            <SkillsEditor value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection num={4} title="How it works">
        <p className="db-field_hint">Numbered steps shown on the service page.</p>
        <Controller
          name="process"
          control={form.control}
          render={({ field }) => (
            <ProcessEditor value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection num={5} title="Common questions">
        <p className="db-field_hint">The first one opens by default.</p>
        <Controller
          name="faqs"
          control={form.control}
          render={({ field }) => (
            <FaqEditor value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormSection>

      <FormSection num={6} title="Hover media">
        <p className="db-field_hint">
          Slides in on the /services list when the row is hovered.
        </p>
        <Controller
          name="media"
          control={form.control}
          render={({ field }) => (
            <MediaSlot
              value={field.value}
              onChange={field.onChange}
              label="image or video (mp4/webm, up to 64MB)"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            />
          )}
        />
      </FormSection>
    </EditorShell>
  );
}

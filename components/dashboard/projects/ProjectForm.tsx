"use client";

import { useTransition } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  NumberField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import EditorShell from "@/components/dashboard/ui/EditorShell";
import DraftBanner from "@/components/dashboard/ui/DraftBanner";
import { useFormDraft } from "@/components/dashboard/ui/useFormDraft";
import FormSection from "@/components/dashboard/ui/FormSection";
import ProjectLivePreview from "@/components/dashboard/projects/ProjectLivePreview";
import { MediaSlot } from "@/components/dashboard/projects/GalleryEditor";
import SectionsEditor from "@/components/dashboard/projects/SectionsEditor";
import {
  CreateProjectSchema,
  cleanSections,
  defaultSections,
  resolveSections,
  type Section,
} from "@/servers/validators/project.validator";
import { createProject, updateProject } from "@/app/action/project.action";
import { getErrorMessage } from "@/lib/utils";
import { Project } from "@/generated/prisma";

type ProjectFormType = z.input<typeof CreateProjectSchema>;

/** Create form when `project` is omitted, edit form otherwise. */
export default function ProjectForm({
  project,
  categories = [],
}: {
  project?: Project;
  /** Service titles; a project's category has to match one to show under that service. */
  categories?: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProjectFormType>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: project?.title ?? "",
      client: project?.client ?? "",
      category: project?.category ?? "",
      summary: project?.summary ?? "",
      content: project?.content ?? "",
      coverImage: project?.coverImage ?? null,
      heroVideo: project?.heroVideo ?? null,
      websiteUrl: project?.websiteUrl ?? "",
      sections: project ? resolveSections(project) : defaultSections(),
      year: project?.year ?? new Date().getFullYear(),
      published: project?.published ?? false,
      featured: project?.featured ?? false,
      order: project?.order ?? 0,
    },
  });

  const draftKey = `db-draft:project:${project?.id ?? "new"}`;
  const clearDraft = useFormDraft(form, draftKey);
  const watched = useWatch({ control: form.control });

  function onSubmit(values: ProjectFormType) {
    startTransition(async () => {
      try {
        const data = { ...values, sections: cleanSections(values.sections) };
        if (project) {
          await updateProject(project.id, data);
          toast.success("Project updated!");
        } else {
          await createProject(data);
          toast.success("Project created!");
        }
        clearDraft();
        router.push("/dashboard/projects");
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
      submitLabel={project ? "Save changes" : "Create project"}
      cancelHref="/dashboard/projects"
      status={
        <>
          <SwitchField control={form.control} name="published" label="Published" />
          <SwitchField control={form.control} name="featured" label="Featured" />
          <NumberField
            control={form.control}
            name="order"
            label="Order"
            hint="Lower comes first. Featured projects always sit above the rest; ties go to the newest."
          />
        </>
      }
      preview={
        <ProjectLivePreview
          values={{
            title: watched.title,
            category: watched.category,
            summary: watched.summary,
            content: watched.content,
            websiteUrl: watched.websiteUrl,
            coverImage: watched.coverImage,
            heroVideo: watched.heroVideo,
            sections: watched.sections as Section[] | undefined,
          }}
        />
      }
    >
      <FormSection num={1} title="Basics">
        <TextField control={form.control} name="title" label="Title" placeholder="Project title" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="client" label="Client" placeholder="Client name" />
          <SelectField
            control={form.control}
            name="category"
            label="Category"
            hint="Matches a service, so the project shows on its page."
            placeholder="Choose a service"
            options={
              project?.category && !categories.includes(project.category)
                ? [...categories, project.category]
                : categories
            }
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField control={form.control} name="year" label="Year" placeholder="2026" />
          <TextField
            control={form.control}
            name="websiteUrl"
            label="Website URL"
            placeholder="https://example.com"
          />
        </div>
        <TextAreaField
          control={form.control}
          name="summary"
          label="Summary"
          placeholder="Short teaser shown on project cards"
        />
        <TextAreaField
          control={form.control}
          name="content"
          label="Case study"
          placeholder="Write the full case study..."
          rows="min-h-64"
        />
      </FormSection>

      <FormSection num={2} title="Media">
        <div className="db-field">
          <span className="db-label">Cover image</span>
          <Controller
            name="coverImage"
            control={form.control}
            render={({ field }) => (
              <MediaSlot
                value={field.value}
                onChange={field.onChange}
                label="cover image (PNG, JPG, WebP up to 8MB)"
                accept="image/*"
                imageOnly
              />
            )}
          />
        </div>
        <div className="db-field">
          <span className="db-label">Hero video</span>
          <p className="db-field_hint">
            Optional. Replaces the cover image on the project page.
          </p>
          <Controller
            name="heroVideo"
            control={form.control}
            render={({ field }) => (
              <MediaSlot
                value={field.value}
                onChange={field.onChange}
                label="hero video (mp4/webm, up to 64MB)"
                accept="video/mp4,video/webm"
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection num={3} title="Page layout">
        <p className="db-field_hint">
          These sections make up the project page, top to bottom. Drag the grip
          to reorder, or add features, tools, results, images and text.
        </p>
        <Controller
          name="sections"
          control={form.control}
          render={({ field }) => (
            <SectionsEditor value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </FormSection>
    </EditorShell>
  );
}

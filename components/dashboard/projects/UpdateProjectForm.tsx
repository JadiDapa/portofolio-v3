"use client";

import { useTransition, useState, useRef } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { UpdateProjectSchema } from "@/servers/validators/project.validator";
import { updateProject } from "@/app/action/project.action";
import { uploadImage } from "@/app/action/upload.action";
import { Project } from "@/generated/prisma";

type UpdateProjectFormType = z.infer<typeof UpdateProjectSchema>;

export default function UpdateProjectForm({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<UpdateProjectFormType>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      title: project.title,
      client: project.client ?? "",
      category: project.category,
      summary: project.summary,
      content: project.content ?? "",
      coverImage: project.coverImage,
      year: project.year ?? undefined,
      published: project.published,
      featured: project.featured,
    },
  });

  const coverImage = useWatch({ control: form.control, name: "coverImage" });
  const displayUrl = previewUrl ?? coverImage ?? null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
    form.setValue("coverImage", null, { shouldDirty: true });
  }

  async function onSubmit(values: UpdateProjectFormType) {
    startTransition(async () => {
      try {
        let coverImageUrl = values.coverImage ?? null;
        if (pendingFile) {
          const fd = new FormData();
          fd.append("file", pendingFile);
          const { url } = await uploadImage(fd);
          coverImageUrl = url;
        }
        await updateProject(project.id, { ...values, coverImage: coverImageUrl });
        toast.success("Project updated!");
        router.push("/dashboard/projects");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
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
            <Input id="title" {...field} placeholder="Project title" />
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
          name="client"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                {...field}
                value={field.value ?? ""}
                placeholder="Client name"
              />
            </div>
          )}
        />

        <Controller
          name="category"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...field}
                placeholder="e.g. Branding, Web Design"
              />
            </div>
          )}
        />
      </div>

      <Controller
        name="summary"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...field}
              placeholder="Short teaser shown on project cards"
              className="min-h-20 resize-y"
            />
          </div>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="content">Case study</Label>
            <Textarea
              id="content"
              {...field}
              placeholder="Write the full case study..."
              className="min-h-64 resize-y"
            />
          </div>
        )}
      />

      <div className="space-y-1.5">
        <Label>Cover Image</Label>
        <div
          role="button"
          tabIndex={0}
          className="hover:border-primary/50 relative w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors"
          style={{ aspectRatio: "16/9" }}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        >
          {displayUrl ? (
            <>
              <img
                src={displayUrl}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove cover image"
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-4">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">Click to upload cover image</p>
              <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <Controller
        name="year"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="2026"
            />
          </div>
        )}
      />

      <div className="flex items-center gap-6">
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

        <Controller
          name="featured"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

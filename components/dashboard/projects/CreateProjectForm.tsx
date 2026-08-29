"use client";

import { useTransition, useState, useRef } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { CreateProjectSchema } from "@/servers/validators/project.validator";
import { createProject } from "@/app/action/project.action";
import { uploadImage } from "@/app/action/upload.action";

type ProjectFormType = z.input<typeof CreateProjectSchema>;

export default function CreateProjectForm() {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<ProjectFormType>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      slug: "",
      title: "",
      client: "",
      category: "",
      summary: "",
      content: "",
      coverImage: undefined,
      year: new Date().getFullYear(),
      published: false,
      featured: false,
    },
  });

  const coverImage = useWatch({ control: form.control, name: "coverImage" });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadImage(fd);
      form.setValue("coverImage", url, { shouldDirty: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: ProjectFormType) {
    startTransition(async () => {
      try {
        await createProject({
          ...values,
          slug: slugify(values.title, { lower: true, strict: true }),
        });
        toast.success("Project created!");
        router.push("/dashboard/projects");
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
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...field}
                placeholder="e.g. Branding, Web Design"
              />
              {fieldState.error && (
                <p className="text-destructive text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        name="summary"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...field}
              placeholder="Short teaser shown on project cards"
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
          onClick={() => !uploading && fileInputRef.current?.click()}
          onKeyDown={(e) =>
            e.key === "Enter" && !uploading && fileInputRef.current?.click()
          }
        >
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove cover image"
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                onClick={(e) => {
                  e.stopPropagation();
                  form.setValue("coverImage", null, { shouldDirty: true });
                }}
              >
                <X className="h-4 w-4" />
              </button>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Spinner />
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-4">
              {uploading ? (
                <Spinner />
              ) : (
                <>
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-sm">Click to upload cover image</p>
                  <p className="text-xs">PNG, JPG, WebP up to 5MB</p>
                </>
              )}
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
        <Button type="submit" disabled={isPending || uploading}>
          {isPending ? <Spinner /> : "Create Project"}
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

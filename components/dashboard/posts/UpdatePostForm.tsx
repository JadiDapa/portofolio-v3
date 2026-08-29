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
import { UpdatePostSchema } from "@/servers/validators/post.validator";
import { updatePost } from "@/app/action/post.action";
import { uploadImage } from "@/app/action/upload.action";
import { Post } from "@/generated/prisma";

type UpdatePostFormType = z.infer<typeof UpdatePostSchema>;

export default function UpdatePostForm({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<UpdatePostFormType>({
    resolver: zodResolver(UpdatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content ?? "",
      thumbnail: post.thumbnail,
      published: post.published,
    },
  });

  const thumbnail = useWatch({ control: form.control, name: "thumbnail" });
  const displayUrl = previewUrl ?? thumbnail ?? null;

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
    form.setValue("thumbnail", null, { shouldDirty: true });
  }

  async function onSubmit(values: UpdatePostFormType) {
    startTransition(async () => {
      try {
        let thumbnailUrl = values.thumbnail ?? null;
        if (pendingFile) {
          const fd = new FormData();
          fd.append("file", pendingFile);
          const { url } = await uploadImage(fd);
          thumbnailUrl = url;
        }
        await updatePost(post.id, { ...values, thumbnail: thumbnailUrl });
        toast.success("Post updated!");
        router.push("/dashboard/posts");
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
            <Input id="title" {...field} placeholder="Post title" />
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...field}
              placeholder="Write your post content..."
              className="min-h-64 resize-y"
            />
          </div>
        )}
      />

      <div className="space-y-1.5">
        <Label>Thumbnail</Label>
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
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove thumbnail"
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-4">
              <ImageIcon className="h-8 w-8" />
              <p className="text-sm">Click to upload thumbnail</p>
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

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/posts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

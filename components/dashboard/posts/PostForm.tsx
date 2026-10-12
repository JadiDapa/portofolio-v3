"use client";

import { useTransition } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  SwitchField,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-fields";
import EditorShell from "@/components/dashboard/ui/EditorShell";
import DraftBanner from "@/components/dashboard/ui/DraftBanner";
import { useFormDraft } from "@/components/dashboard/ui/useFormDraft";
import FormSection from "@/components/dashboard/ui/FormSection";
import PostLivePreview from "@/components/dashboard/posts/PostLivePreview";
import { MediaSlot } from "@/components/dashboard/projects/GalleryEditor";
import { CreatePostSchema } from "@/servers/validators/post.validator";
import { createPost, updatePost } from "@/app/action/post.action";
import { getErrorMessage } from "@/lib/utils";
import { Post } from "@/generated/prisma";

type PostFormType = z.input<typeof CreatePostSchema>;

type Props = (
  | { post: Post; authorId?: never }
  | { post?: undefined; authorId: number }
) & {
  /** Byline shown in the live preview. */
  authorName?: string;
};

/** Create form (written by `authorId`) when `post` is omitted, edit form otherwise. */
export default function PostForm({ post, authorId, authorName = "You" }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PostFormType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: post?.title ?? "",
      content: post?.content ?? "",
      thumbnail: post?.thumbnail ?? null,
      published: post?.published ?? false,
      authorId: post?.authorId ?? authorId,
    },
  });

  const draftKey = `db-draft:post:${post?.id ?? "new"}`;
  const clearDraft = useFormDraft(form, draftKey);
  const watched = useWatch({ control: form.control });

  function onSubmit(values: PostFormType) {
    startTransition(async () => {
      try {
        if (post) {
          await updatePost(post.id, values);
          toast.success("Post updated!");
        } else {
          await createPost(values);
          toast.success("Post created!");
        }
        clearDraft();
        router.push("/dashboard/posts");
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
      submitLabel={post ? "Save changes" : "Create entry"}
      cancelHref="/dashboard/posts"
      status={<SwitchField control={form.control} name="published" label="Published" />}
      preview={
        <PostLivePreview
          title={watched.title}
          content={watched.content}
          thumbnail={watched.thumbnail}
          author={authorName}
        />
      }
    >
      <FormSection num={1} title="Words">
        <TextField control={form.control} name="title" label="Title" placeholder="Post title" />
        <TextAreaField
          control={form.control}
          name="content"
          label="Content"
          hint="HTML is rendered as written, exactly like the public page."
          placeholder="Write your post content..."
          rows="min-h-96"
        />
      </FormSection>

      <FormSection num={2} title="Cover">
        <Controller
          name="thumbnail"
          control={form.control}
          render={({ field }) => (
            <MediaSlot
              value={field.value}
              onChange={field.onChange}
              label="thumbnail (PNG, JPG, WebP up to 8MB)"
              accept="image/*"
              imageOnly
            />
          )}
        />
      </FormSection>
    </EditorShell>
  );
}

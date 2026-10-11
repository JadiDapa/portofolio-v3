"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Columns2,
  ImageIcon,
  Trash2,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { uploadImage, uploadMedia } from "@/app/action/upload.action";
import { getErrorMessage } from "@/lib/utils";
import { isVideo } from "@/lib/format";
import type {
  GalleryBlock,
  GalleryItem,
} from "@/servers/validators/project.validator";

export function MediaSlot({
  value,
  onChange,
  accept,
  label,
  aspect = "16/9",
  imageOnly = false,
}: {
  value?: string | null;
  onChange: (src: string | null) => void;
  accept: string;
  label: string;
  aspect?: string;
  /** Uses the stricter 5MB image upload instead of the 50MB image/video one. */
  imageOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await (imageOnly ? uploadImage : uploadMedia)(fd);
      onChange(url);
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className="hover:border-primary/50 relative w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors"
        style={{ aspectRatio: aspect }}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) =>
          e.key === "Enter" && !uploading && inputRef.current?.click()
        }
      >
        {value ? (
          <>
            {isVideo(value) ? (
              <video
                src={value}
                muted
                loop
                playsInline
                autoPlay
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              aria-label={`Remove ${label}`}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 p-4">
            <ImageIcon className="h-6 w-6" />
            <p className="text-sm">Upload {label}</p>
          </div>
        )}
        {uploading && (
          <div className="bg-background/70 absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

const EMPTY: GalleryItem = { src: "" };

function newBlock(kind: GalleryBlock["kind"]): GalleryBlock {
  if (kind === "grid") return { kind, items: [{ ...EMPTY }, { ...EMPTY }] };
  return { kind, item: { ...EMPTY } };
}

/** Ordered list of gallery blocks: 2-up square grid, full-width image or video. */
export default function GalleryEditor({
  value,
  onChange,
}: {
  value: GalleryBlock[];
  onChange: (blocks: GalleryBlock[]) => void;
}) {
  const update = (i: number, block: GalleryBlock) =>
    onChange(value.map((b, idx) => (idx === i ? block : b)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No gallery blocks yet. Blocks are shown in this order under the intro.
        </p>
      )}

      {value.map((block, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium capitalize">
              {i + 1}.{" "}
              {block.kind === "grid" ? "Two squares" : `Full-width ${block.kind}`}
            </p>
            <div className="flex gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Move down"
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Remove block"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {block.kind === "grid" ? (
            <div className="grid grid-cols-2 gap-3">
              {block.items.map((item, s) => (
                <MediaSlot
                  key={s}
                  value={item.src || null}
                  label={`square ${s + 1}`}
                  aspect="1/1"
                  accept="image/*,video/mp4,video/webm"
                  onChange={(src) =>
                    update(i, {
                      ...block,
                      items: block.items.map((it, idx) =>
                        idx === s ? { ...it, src: src ?? "" } : it,
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <MediaSlot
              value={block.item.src || null}
              label={block.kind}
              aspect="16/9"
              accept={
                block.kind === "video" ? "video/mp4,video/webm" : "image/*"
              }
              onChange={(src) =>
                update(i, { ...block, item: { ...block.item, src: src ?? "" } })
              }
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, newBlock("grid")])}
        >
          <Columns2 className="h-4 w-4" /> Add two squares
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, newBlock("image")])}
        >
          <ImageIcon className="h-4 w-4" /> Add image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, newBlock("video")])}
        >
          <Video className="h-4 w-4" /> Add video
        </Button>
      </div>
    </div>
  );
}

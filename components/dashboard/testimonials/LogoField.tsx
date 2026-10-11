"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { uploadImage } from "@/app/action/upload.action";

/** Company logo picker for a testimonial: uploads through the shared image action. */
export default function LogoField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadImage(fd);
      onChange(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>Company logo</Label>
      <div className="flex items-center gap-3">
        <div className="bg-muted relative flex h-14 w-28 items-center justify-center overflow-hidden rounded-md border">
          {value ? (
            <Image src={value} alt="" fill sizes="112px" className="object-contain p-2" />
          ) : (
            <ImagePlus className="text-muted-foreground size-5" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => input.current?.click()}
        >
          {uploading ? <Spinner /> : value ? "Replace" : "Upload"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="size-4" />
          </Button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={onFile}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        Shown in the logo row under the testimonials. Falls back to the company name.
      </p>
    </div>
  );
}

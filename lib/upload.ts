import { genUploader } from "uploadthing/client";
import type { UploadRouter } from "@/app/api/uploadthing/core";
import { optimiseUpload } from "@/app/action/upload.action";

const { uploadFiles } = genUploader<UploadRouter>();

const OPTIMISED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Uploads from the browser straight to UploadThing and returns the file's public URL.
 * `image` takes PNG/JPG/WebP/GIF up to 8MB; `media` also takes mp4/webm up to 64MB.
 * Stills are then swapped server-side for an optimised WebP; GIFs and video are kept as-is.
 */
export async function uploadFile(file: File, endpoint: "image" | "media"): Promise<string> {
  const [res] = await uploadFiles(endpoint, { files: [file] });

  if (OPTIMISED.includes(file.type)) {
    return (await optimiseUpload(res.key, res.ufsUrl)).url;
  }
  return new URL(`/f/${res.customId ?? res.key}`, res.ufsUrl).href;
}

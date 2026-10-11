"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "uploads/images");

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MEDIA_TYPES: Record<string, string> = {
  ...IMAGE_TYPES,
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const MB = 1024 * 1024;

/** Longest edge kept for stills: sharp on a 4K retina screen, far lighter than a phone-camera original. */
const MAX_WIDTH = 2400;

const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/**
 * JPEG/PNG/WebP stills become auto-rotated, metadata-free WebP no wider than MAX_WIDTH.
 * The dominant colour is baked into the filename (`<uuid>-c8a7b5.webp`) so the site can
 * paint a placeholder from the URL alone, with no extra column or request (see lib/placeholder).
 * GIFs (animation) and video are stored untouched.
 */
async function optimiseImage(file: File): Promise<{ filename: string; data: Buffer }> {
  const input = Buffer.from(await file.arrayBuffer());

  // Animated WebP keeps its frames; everything else is a single still
  const pipeline = sharp(input, { animated: file.type === "image/webp" }).rotate();
  const data = await pipeline
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const { dominant } = await sharp(data).stats();
  const colour = `${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;

  return { filename: `${crypto.randomUUID()}-${colour}.webp`, data };
}

/** The extension comes from the validated MIME type, never from the client's filename. */
async function saveUpload(
  formData: FormData,
  allowed: Record<string, string>,
  maxSize: number,
): Promise<{ url: string }> {
  await requireAdmin();

  const file = formData.get("file");

  if (!file || typeof file === "string") throw new Error("No file provided");
  const ext = allowed[file.type];
  if (!ext) throw new Error("File type not allowed");
  if (file.size > maxSize) {
    throw new Error(`File exceeds ${Math.round(maxSize / MB)}MB limit`);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const isStill = file.type in IMAGE_TYPES && file.type !== "image/gif";

  if (isStill) {
    let optimised: { filename: string; data: Buffer };
    try {
      optimised = await optimiseImage(file);
    } catch {
      throw new Error("That image could not be read. Try exporting it again.");
    }
    await writeFile(path.join(UPLOAD_DIR, optimised.filename), optimised.data);
    return { url: `/api/images/${optimised.filename}` };
  }

  const filename = `${crypto.randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  return { url: `/api/images/${filename}` };
}

export async function uploadImage(formData: FormData) {
  return saveUpload(formData, IMAGE_TYPES, 5 * MB);
}

/** Like `uploadImage`, but also accepts mp4/webm (up to 50MB). */
export async function uploadMedia(formData: FormData) {
  return saveUpload(formData, MEDIA_TYPES, 50 * MB);
}

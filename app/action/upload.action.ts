"use server";

import sharp from "sharp";
import { UTApi, UTFile } from "uploadthing/server";
import { requireAdmin } from "@/lib/auth";

const utapi = new UTApi();

/** Longest edge kept for stills: sharp on a 4K retina screen, far lighter than a phone-camera original. */
const MAX_WIDTH = 2400;

const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");

/**
 * JPEG/PNG/WebP stills become auto-rotated, metadata-free WebP no wider than MAX_WIDTH.
 * The dominant colour is baked into the id (`<uuid>-c8a7b5.webp`) so the site can
 * paint a placeholder from the URL alone, with no extra column or request (see lib/placeholder).
 */
async function optimiseImage(input: Buffer, type: string): Promise<{ id: string; data: Buffer }> {
  // Animated WebP keeps its frames; everything else is a single still
  const pipeline = sharp(input, { animated: type === "image/webp" }).rotate();
  const data = await pipeline
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const { dominant } = await sharp(data).stats();
  const colour = `${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`;

  return { id: `${crypto.randomUUID()}-${colour}.webp`, data };
}

/** Uploads `data` under `id` and returns the URL that serves it by that id. */
async function store(data: Buffer, id: string, type: string): Promise<string> {
  const [res] = await utapi.uploadFiles([new UTFile([new Uint8Array(data)], id, { type, customId: id })]);
  if (res.error) throw new Error(res.error.message);
  return new URL(`/f/${id}`, res.data.ufsUrl).href;
}

/**
 * Swaps a still the browser just uploaded (see app/api/uploadthing) for its optimised
 * WebP, then deletes the original. The raw upload is removed even if optimising fails.
 */
export async function optimiseUpload(key: string, url: string): Promise<{ url: string }> {
  await requireAdmin();

  // Only ever fetch the file that was just uploaded, never an arbitrary URL
  const src = new URL(url);
  if (!src.hostname.endsWith(".ufs.sh") || src.pathname !== `/f/${key}`) {
    throw new Error("Invalid upload");
  }

  try {
    const res = await fetch(src);
    if (!res.ok) throw new Error("Upload could not be read back");
    const type = res.headers.get("content-type") ?? "";

    let optimised: { id: string; data: Buffer };
    try {
      optimised = await optimiseImage(Buffer.from(await res.arrayBuffer()), type);
    } catch {
      throw new Error("That image could not be read. Try exporting it again.");
    }

    return { url: await store(optimised.data, optimised.id, "image/webp") };
  } finally {
    await utapi.deleteFiles(key);
  }
}

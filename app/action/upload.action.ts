"use server";

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads/images");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  const file = formData.get("file");

  if (!file || typeof file === "string") throw new Error("No file provided");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("File type not allowed");
  if (file.size > MAX_SIZE) throw new Error("File exceeds 5MB limit");

  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;

  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });

  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  return { url: `/api/images/${filename}` };
}

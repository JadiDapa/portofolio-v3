import slugify from "slugify";
import { z } from "zod";

export function toSlug(title: string) {
  return slugify(title, { lower: true, strict: true });
}

/** An http(s) URL, or "" for "none" (what a cleared text input produces). */
export const optionalUrl = z.union([z.url("Must be a valid URL"), z.literal("")]);

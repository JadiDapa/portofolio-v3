import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFiles } from "uploadthing/server";
import { requireAdmin } from "@/lib/auth";

const f = createUploadthing();

/** GIFs and video are stored untouched, so they get their final id up front. Stills are re-uploaded by `optimiseUpload`. */
const KEPT_AS_IS: Record<string, string> = {
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const STILLS = {
  "image/jpeg": { maxFileSize: "8MB" },
  "image/png": { maxFileSize: "8MB" },
  "image/webp": { maxFileSize: "8MB" },
  "image/gif": { maxFileSize: "8MB" },
} as const;

async function adminOnly(files: readonly { name: string; size: number; type: string }[]) {
  try {
    await requireAdmin();
  } catch {
    throw new UploadThingError("Unauthorized");
  }

  // The id ends in the extension so `isVideo()` can tell a video from its URL
  return {
    [UTFiles]: files.map((file) =>
      KEPT_AS_IS[file.type]
        ? { ...file, customId: `${crypto.randomUUID()}${KEPT_AS_IS[file.type]}` }
        : file,
    ),
  };
}

/**
 * The browser uploads straight to UploadThing, so files never pass through a server
 * function (Vercel caps those request bodies at 4.5MB).
 */
export const uploadRouter = {
  image: f(STILLS, { awaitServerData: false })
    .middleware(({ files }) => adminOnly(files))
    .onUploadComplete(() => {}),

  media: f(
    {
      ...STILLS,
      "video/mp4": { maxFileSize: "64MB" },
      "video/webm": { maxFileSize: "64MB" },
    },
    { awaitServerData: false },
  )
    .middleware(({ files }) => adminOnly(files))
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

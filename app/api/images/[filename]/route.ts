import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  // Prevent path traversal attacks
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads/images", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const { size } = statSync(filePath);
  const headers: Record<string, string> = {
    "Content-Type": getContentType(filename),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  // Video needs byte-range support to play and seek
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") ?? "");
  let start = 0;
  let end = size - 1;
  let status = 200;

  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), size - 1);
    } else {
      start = Math.max(size - Number(range[2]), 0);
    }
    if (start > end || start >= size) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${size}` },
      });
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }

  headers["Content-Length"] = String(end - start + 1);

  const stream = createReadStream(filePath, { start, end });

  // Convert Node stream → Web stream
  const webStream = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

  return new NextResponse(webStream, { status, headers });
}

// Simple MIME type helper
function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}

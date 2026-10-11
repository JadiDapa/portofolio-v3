"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import type {
  GalleryBlock,
  GalleryItem,
} from "@/servers/validators/project.validator";

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/** One bordered media box that rises into place once it is on screen. */
function Media({
  item,
  className,
  natural,
}: {
  item: GalleryItem;
  className?: string;
  /** Keep the image's own aspect ratio instead of cropping to the box. */
  natural?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const playing = useInView(ref, { amount: 0.25 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <div
      ref={ref}
      data-visible={seen || undefined}
      className={cn("wk-b wk-media-wipe overflow-hidden bg-[#0f0f0f]", className)}
    >
      {isVideo(item.src) ? (
        <video
          ref={videoRef}
          src={item.src}
          className="wk-media-fill"
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          className={natural ? "block h-auto w-full" : "wk-media-fill"}
        />
      )}
    </div>
  );
}

export default function ProjectGallery({ blocks }: { blocks: GalleryBlock[] }) {
  if (blocks.length === 0) return null;

  return (
    <section>
      {blocks.map((block, i) => {
        if (block.kind === "grid") {
          return (
            <div key={i} className="wk-grid wk-gap">
              {block.items.map((item, s) => (
                <Media key={s} item={item} className="wk-media-sq col-span-2" />
              ))}
            </div>
          );
        }
        if (block.kind === "video") {
          return (
            <div key={i} className="wk-gap">
              <Media item={block.item} className="wk-media-video" />
            </div>
          );
        }
        return (
          <div key={i} className="wk-gap">
            <Media item={block.item} natural />
          </div>
        );
      })}
    </section>
  );
}

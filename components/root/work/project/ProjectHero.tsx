import Image from "next/image";
import { blurProps } from "@/lib/placeholder";

/** Full-width media box: looping muted video when there is one, else the cover image. */
export default function ProjectHero({
  title,
  coverImage,
  heroVideo,
}: {
  title: string;
  coverImage: string | null;
  heroVideo: string | null;
}) {
  if (!heroVideo && !coverImage) return null;

  return (
    <div className="wk-b wk-fade-in wk-media-video relative overflow-hidden bg-foreground">
      {heroVideo ? (
        <video
          src={heroVideo}
          poster={coverImage ?? undefined}
          className="wk-media-fill"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          aria-label={title}
        />
      ) : (
        <Image
          src={coverImage!}
          alt={title}
          fill
          {...blurProps(coverImage)}
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

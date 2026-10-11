import Image from "next/image";

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
    <div className="wk-b wk-fade-in wk-media-video relative overflow-hidden bg-[#0f0f0f]">
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
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
    </div>
  );
}

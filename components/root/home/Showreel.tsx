"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Asterisk, Film } from "lucide-react";

/** Drop the reel at public/home/showreel.mp4; until it exists the still below is shown. */
const VIDEO_SRC = "/home/showreel.mp4";
const POSTER =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop";

/** Framed reel under the hero: icon tiles sit on the frame's top-right corner. */
export default function Showreel() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <section className="px-gutter pt-(--gutter-pad)" data-sec="showreel">
      <div className="flex justify-end">
        <div className="sv-tile wk-b flex">
          <Film strokeWidth={1.3} aria-hidden />
        </div>
        <div className="sv-tile sv-tile--dark flex">
          <Asterisk strokeWidth={1.8} aria-hidden />
        </div>
      </div>

      <div className="wk-b wk-glass hm-reel" data-cmp="showreel">
        <motion.div
          className="hm-reel-media"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={POSTER}
            alt="Recent work showreel"
            fill
            sizes="(min-width: 1500px) 1400px, 100vw"
            className="object-cover"
          />
          <video
            ref={video}
            className="hm-reel-video"
            data-playing={playing || undefined}
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            onPlaying={() => setPlaying(true)}
            onError={() => setPlaying(false)}
          />
        </motion.div>
      </div>
    </section>
  );
}

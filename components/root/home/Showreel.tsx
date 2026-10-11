"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Asterisk, Film } from "lucide-react";
import InView from "@/components/root/shared/InView";

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
      <InView className="hm-pop flex justify-end" threshold={0.5}>
        <div className="sv-tile wk-b flex">
          <Film strokeWidth={1.3} aria-hidden />
        </div>
        <div className="sv-tile sv-tile--dark flex">
          <Asterisk strokeWidth={1.8} aria-hidden />
        </div>
      </InView>

      <div className="wk-b wk-glass hm-reel" data-cmp="showreel">
        {/* Unmasks from an inset frame while the picture settles from a slight zoom.
            clip-path ends at inset(0 round 0): the media's own radius still rounds it. */}
        <motion.div
          className="hm-reel-media"
          initial={{ clipPath: "inset(14% 14% 14% 14% round 8px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
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
        </motion.div>
      </div>
    </section>
  );
}

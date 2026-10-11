"use client";

import RevealHeading from "@/components/root/work/RevealHeading";

/** Footer CTA heading: letters rise in once it scrolls into view. */
export default function ChatTitle({ text }: { text: string }) {
  return (
    <p className="hm-chat-title" aria-label={text}>
      <RevealHeading text={text} inView />
    </p>
  );
}

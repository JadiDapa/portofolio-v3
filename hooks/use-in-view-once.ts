import { useEffect, useRef, useState } from "react";

/**
 * Flips `visible` to true the first time the ref'd element scrolls into view,
 * then stops observing. Drives the `data-visible` reveal animations.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const { root, rootMargin, threshold } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);

  return [ref, visible] as const;
}

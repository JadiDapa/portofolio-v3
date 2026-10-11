"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LENS = 16; // % — clip-path circle radius
const RING = 16.25; // % — dark ring just outside the lens
const EASE = 0.18; // lens follows the cursor with this per-frame lerp
const CELL = 6; // css px between dots

/** Draws `img` as a 45°-rotated halftone that covers the canvas. */
function paintHalftone(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const { width: cw, height: ch } = canvas.getBoundingClientRect();
  if (!cw || !ch) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);

  // Sample a cover-cropped copy of the photo at canvas size.
  const sample = document.createElement("canvas");
  sample.width = canvas.width;
  sample.height = canvas.height;
  const sctx = sample.getContext("2d", { willReadFrequently: true });
  const ctx = canvas.getContext("2d");
  if (!sctx || !ctx) return;
  const scale = Math.max(sample.width / img.naturalWidth, sample.height / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  sctx.drawImage(img, (sample.width - dw) / 2, (sample.height - dh) / 2, dw, dh);
  const { data, width: sw, height: sh } = sctx.getImageData(0, 0, sample.width, sample.height);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f0f0f";

  const step = CELL * dpr;
  const max = step * 0.62;
  const cos = Math.SQRT1_2;
  const reach = Math.hypot(canvas.width, canvas.height);
  for (let u = -reach; u < reach; u += step) {
    for (let v = -reach; v < reach; v += step) {
      const x = (u - v) * cos + canvas.width / 2;
      const y = (u + v) * cos + canvas.height / 2;
      if (x < -step || y < -step || x > canvas.width + step || y > canvas.height + step) continue;
      const px = Math.min(sw - 1, Math.max(0, Math.round(x)));
      const py = Math.min(sh - 1, Math.max(0, Math.round(y)));
      const k = (py * sw + px) * 4;
      const lum = (0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2]) / 255;
      // Push mid-tones apart so the result reads as hard black & white.
      const dark = Math.min(1, Math.max(0, (1 - lum - 0.12) * 1.5));
      if (dark < 0.04) continue;
      ctx.beginPath();
      ctx.arc(x, y, max * Math.sqrt(dark), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Colour photo with a halftone twin. A lens trails the cursor showing the
 * other version; clicking swaps which one fills the frame.
 */
export default function HalftonePhoto({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState(false);

  const pos = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999, raf: 0 });

  // Halftone render, redrawn when the frame resizes.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    let ready = false;
    const draw = () => ready && paintHalftone(el, img);
    img.onload = () => {
      ready = true;
      draw();
    };
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, [src]);

  // Apply the lens to whichever layer sits on top.
  useEffect(() => {
    const apply = () => {
      const { x, y } = pos.current;
      const at = `at ${x.toFixed(2)}px ${y.toFixed(2)}px`;
      const lens = `circle(${LENS}% ${at})`;
      if (ring.current) ring.current.style.clipPath = `circle(${RING}% ${at})`;
      if (dots.current) dots.current.style.clipPath = toggle ? "none" : lens;
      if (media.current) media.current.style.clipPath = toggle ? lens : "none";
    };
    apply();

    const p = pos.current;
    const tick = () => {
      p.x += (p.tx - p.x) * EASE;
      p.y += (p.ty - p.y) * EASE;
      apply();
      p.raf =
        Math.abs(p.tx - p.x) > 0.1 || Math.abs(p.ty - p.y) > 0.1
          ? requestAnimationFrame(tick)
          : 0;
    };
    const el = root.current;
    const move = (e: PointerEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      p.tx = e.clientX - r.left;
      p.ty = e.clientY - r.top;
      // First contact: start the lens at the edge the cursor came from.
      if (p.x < -9000) {
        p.x = p.tx;
        p.y = p.ty;
      }
      if (!p.raf) p.raf = requestAnimationFrame(tick);
    };
    // Track globally while near so the lens drifts out on leave.
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(p.raf);
      p.raf = 0;
    };
  }, [toggle]);

  return (
    <button
      ref={root}
      type="button"
      aria-label={alt}
      aria-pressed={toggle}
      data-toggle={toggle || undefined}
      onClick={() => setToggle((t) => !t)}
      className={cn("ab-photo", className)}
    >
      <div ref={media} className="ab-photo_media">
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <div ref={ring} className="ab-photo_ring" />
      <div ref={dots} className="ab-photo_dots">
        <canvas ref={canvas} aria-hidden />
      </div>
    </button>
  );
}

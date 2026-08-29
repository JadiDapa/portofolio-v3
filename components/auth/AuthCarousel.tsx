"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2070",
    caption: "Write and publish in minutes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070",
    caption: "A clean, focused writing experience",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1170",
    caption: "Built for creators and readers alike",
  },
];

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[currentIndex];

  return (
    <div className="relative hidden flex-1 lg:block">
      <figure className="relative h-full w-full">
        <Image
          src={slide.image}
          alt={slide.caption}
          fill
          className="object-cover object-center transition-opacity duration-700"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-8 text-lg font-medium text-white">
          {slide.caption}
        </figcaption>
      </figure>

      <div className="absolute bottom-4 left-8 flex gap-1.5">
        {SLIDES.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

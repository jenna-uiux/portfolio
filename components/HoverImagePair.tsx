"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = {
  src: string;
  alt: string;
};

export function HoverImagePair({ images }: { images: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="not-prose">
      <div className="group relative aspect-video overflow-hidden rounded-none bg-black">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={[
              "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={image.src}
              alt={index === activeIndex ? image.alt : ""}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div
          className="mt-4 flex items-center justify-center gap-2"
          aria-label="Problem image slideshow"
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                "rounded-full bg-current transition-[width,height,opacity] duration-300",
                index === activeIndex
                  ? "h-2 w-2 opacity-100"
                  : "h-1.5 w-1.5 opacity-40",
              ].join(" ")}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

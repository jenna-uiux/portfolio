"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ImageRatio } from "@/lib/projects";

type CarouselImage = { src: string; alt: string };

type Props = {
  images: CarouselImage[];
  ratio?: ImageRatio;
  caption?: string;
};

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

export function ImageCarousel({ images, ratio = "16/9", caption }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = slideRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = slides.indexOf(entry.target as HTMLDivElement);
          if (idx === -1) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.5) {
          setActive(best.index);
        }
      },
      {
        root: track,
        threshold: [0.25, 0.5, 0.75, 1],
      }
    );

    slides.forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [images.length]);

  const goTo = (index: number) => {
    const slide = slideRefs.current[index];
    if (!slide) return;
    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <figure>
      <div
        ref={trackRef}
        className="relative flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl bg-black/[0.02] ring-1 ring-black/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label={caption ?? "Image carousel"}
      >
        {images.map((image, i) => (
          <div
            key={image.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={[
              "relative w-full shrink-0 snap-start",
              ratioClass[ratio],
            ].join(" ")}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 70vw, 100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {images.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive ? "true" : undefined}
              className="block h-2 w-2 rounded-full transition-all duration-300"
              style={{
                background: isActive
                  ? "var(--accent)"
                  : "rgba(23, 23, 23, 0.18)",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {caption ? (
        <figcaption className="mt-3 text-center t-mono">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

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
  "4/3": "aspect-[4/3]",
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
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    const slide = slideRefs.current[clamped];
    if (!slide) return;
    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const atStart = active === 0;
  const atEnd = active === images.length - 1;

  return (
    <figure>
      <div className="relative">
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

        <CarouselArrow
          direction="prev"
          onClick={() => goTo(active - 1)}
          disabled={atStart}
        />
        <CarouselArrow
          direction="next"
          onClick={() => goTo(active + 1)}
          disabled={atEnd}
        />
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

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={[
        "absolute top-1/2 -translate-y-1/2",
        isPrev ? "left-3 md:left-4" : "right-3 md:right-4",
        "z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_22px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-all duration-200",
        "hover:scale-105 hover:shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_28px_-12px_rgba(0,0,0,0.45)]",
        "disabled:pointer-events-none disabled:opacity-0",
      ].join(" ")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        className={isPrev ? "" : "rotate-180"}
      >
        <path
          d="M9 2 L4 7 L9 12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

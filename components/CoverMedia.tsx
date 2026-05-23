"use client";

import Image from "next/image";
import type { ImagePlaceholder, ImageRatio } from "@/lib/projects";
import { ImageSlot } from "./ImageSlot";
import { MediaVideo } from "./MediaVideo";

type Props = {
  cover: ImagePlaceholder;
  /** Overrides `cover.ratio` when set (e.g. teaser layout) */
  ratio?: ImageRatio;
  compact?: boolean;
  className?: string;
};

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

export function CoverMedia({ cover, ratio, compact, className }: Props) {
  const r = ratio ?? cover.ratio ?? "16/9";

  const isVideo =
    cover.videoSrc &&
    !/\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(cover.videoSrc);

  if (isVideo) {
    return (
      <MediaVideo
        src={cover.videoSrc!}
        description={cover.description}
        ratio={r}
        autoPlay
        loop
        controls={false}
        className={[
          compact ? "rounded-md" : "rounded-lg",
          "border border-ink/10",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  const imgSrc = cover.src ?? cover.videoSrc;
  if (imgSrc) {
    return (
      <div
        className={[
          "relative w-full overflow-hidden",
          ratioClass[r],
          compact ? "rounded-md" : "rounded-lg",
          "border border-ink/10",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Image
          src={imgSrc}
          alt={cover.description}
          fill
          priority
          sizes="(min-width: 1280px) 1100px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <ImageSlot
      filename={cover.filename}
      description={cover.description}
      ratio={r}
      compact={compact}
      className={className}
    />
  );
}

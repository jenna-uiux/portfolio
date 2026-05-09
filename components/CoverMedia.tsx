"use client";

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

export function CoverMedia({ cover, ratio, compact, className }: Props) {
  const r = ratio ?? cover.ratio ?? "16/9";

  if (cover.videoSrc) {
    return (
      <MediaVideo
        src={cover.videoSrc}
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

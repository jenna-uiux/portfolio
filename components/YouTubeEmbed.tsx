"use client";

import { buildYouTubeEmbedSrc } from "@/lib/youtube";

/** Fills a positioned parent (e.g. `MediaVideo` relative + `aspect-*` box). */

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

type Props = {
  videoId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
};

export function YouTubeEmbed({
  videoId,
  title,
  className = "",
  autoPlay = false,
  loop = false,
  controls = true,
}: Props) {
  const src = buildYouTubeEmbedSrc(videoId, {
    autoPlay,
    loop,
    showControls: controls,
  });

  return (
    <iframe
      className={["absolute inset-0 h-full w-full border-0", className]
        .filter(Boolean)
        .join(" ")}
      src={src}
      title={title}
      loading="lazy"
      allow={IFRAME_ALLOW}
      allowFullScreen
    />
  );
}

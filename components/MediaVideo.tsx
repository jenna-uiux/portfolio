"use client";

import { useState } from "react";

import type { ImageRatio } from "@/lib/projects";

function resolveMediaUrl(url: string) {
  const base = process.env.NEXT_PUBLIC_MEDIA_CDN_BASE;
  if (!base) return url;
  if (!url.startsWith("/media/")) return url;
  return `${base.replace(/\/$/, "")}${url}`;
}

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

type Props = {
  src: string;
  description: string;
  ratio?: ImageRatio;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  objectFit?: "cover" | "contain";
};

export function MediaVideo({
  src,
  description,
  ratio = "16/9",
  poster,
  className = "",
  autoPlay = false,
  loop = false,
  muted,
  controls = true,
  objectFit = "cover",
}: Props) {
  const [errored, setErrored] = useState(false);
  const effectiveMuted = autoPlay ? true : (muted ?? false);
  const resolvedSrc = resolveMediaUrl(src);
  const resolvedPoster = poster ? resolveMediaUrl(poster) : undefined;

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-lg",
        errored ? "border border-dashed border-ink/18 bg-white/40" : "bg-white",
        ratioClass[ratio],
        className,
      ].join(" ")}
    >
      {errored ? (
        <>
          <div aria-hidden className="absolute inset-0 grain opacity-20" />
          <div className="absolute left-4 top-4 t-mono">Drop video here</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="max-w-[34ch] t-caption">{description}</p>
            <p className="mt-3 max-w-[44ch] break-all t-mono">{resolvedSrc}</p>
          </div>
        </>
      ) : (
        <video
          className={[
            "absolute inset-0 h-full w-full",
            objectFit === "contain" ? "object-contain" : "object-cover",
          ].join(" ")}
          src={resolvedSrc}
          poster={resolvedPoster}
          controls={controls}
          playsInline
          preload={autoPlay ? "auto" : "metadata"}
          autoPlay={autoPlay}
          loop={loop}
          muted={effectiveMuted}
          aria-label={description}
          onError={() => setErrored(true)}
        >
          {description}
        </video>
      )}
    </div>
  );
}

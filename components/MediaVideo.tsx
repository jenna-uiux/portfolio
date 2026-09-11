"use client";

import { useEffect, useRef, useState } from "react";

import type { ImageRatio } from "@/lib/projects";
import { isYouTubeMediaUrl, parseYouTubeId } from "@/lib/youtube";
import { YouTubeEmbed } from "./YouTubeEmbed";

function resolveMediaUrl(url: string) {
  const base = process.env.NEXT_PUBLIC_MEDIA_CDN_BASE;
  if (!base) return url;
  if (!url.startsWith("/media/")) return url;
  return `${base.replace(/\/$/, "")}${url}`;
}

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const resolvedSrc = resolveMediaUrl(src);
  const resolvedPoster = poster ? resolveMediaUrl(poster) : undefined;
  const youTubeId = isYouTubeMediaUrl(src) ? parseYouTubeId(src) : null;

  // Only attach the real src once near the viewport — avoids downloading
  // 50–150MB hero/demo clips that are still off-screen.
  useEffect(() => {
    if (youTubeId) return;
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [youTubeId]);

  // Autoplay when visible; pause when scrolled away (muted required by browsers).
  useEffect(() => {
    if (!shouldLoad || !autoPlay || youTubeId) return;
    const node = containerRef.current;
    const video = videoRef.current;
    if (!node || !video) return;

    let cancelled = false;
    let visible = false;

    const play = () => {
      if (cancelled || !visible) return;
      video.muted = true;
      video.defaultMuted = true;
      void video.play().catch(() => {
        if (!cancelled && visible) setPlayBlocked(true);
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      visible = true;
      play();
      return () => { cancelled = true; video.pause(); };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (entry?.isIntersecting) {
          play();
        } else {
          video.pause();
        }
      },
      { rootMargin: "80px 0px", threshold: 0.2 }
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
      video.pause();
    };
  }, [shouldLoad, autoPlay, youTubeId, resolvedSrc]);

  return (
    <div
      ref={containerRef}
      className={[
        "relative w-full overflow-hidden rounded-lg",
        errored ? "border border-dashed border-ink/18 bg-white/40" : "bg-black",
        ratioClass[ratio],
        className,
      ].join(" ")}
    >
      {youTubeId && !errored ? (
        <YouTubeEmbed
          videoId={youTubeId}
          title={description}
          autoPlay={autoPlay}
          loop={loop}
          controls={controls}
        />
      ) : errored ? (
        <>
          <div aria-hidden className="absolute inset-0 grain opacity-20" />
          <div className="absolute left-4 top-4 t-mono">Drop video here</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="max-w-[34ch] t-caption">{description}</p>
            <p className="mt-3 max-w-[44ch] break-all t-mono">{resolvedSrc}</p>
          </div>
        </>
      ) : youTubeId === null && isYouTubeMediaUrl(src) ? (
        <>
          <div aria-hidden className="absolute inset-0 grain opacity-20" />
          <div className="absolute left-4 top-4 t-mono">Invalid YouTube URL</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="max-w-[34ch] t-caption">{description}</p>
            <p className="mt-3 max-w-[44ch] break-all t-mono">{src}</p>
          </div>
        </>
      ) : (
        <>
          {!shouldLoad ? (
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-ink/[0.04]"
            />
          ) : null}
          <video
            ref={videoRef}
            className={[
              "absolute inset-0 h-full w-full",
              objectFit === "contain" ? "object-contain" : "object-cover",
            ].join(" ")}
            src={shouldLoad ? resolvedSrc : undefined}
            poster={resolvedPoster}
            controls={controls}
            autoPlay={autoPlay}
            playsInline
            preload={shouldLoad ? (autoPlay ? "auto" : "metadata") : "none"}
            loop={loop}
            muted={autoPlay ? true : (muted ?? false)}
            aria-label={description}
            onError={() => setErrored(true)}
            onPlaying={() => setPlayBlocked(false)}
          >
            {description}
          </video>
          {playBlocked && !controls ? (
            <button
              type="button"
              aria-label={`Play ${description}`}
              className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white ring-1 ring-white/50"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void videoRef.current?.play().catch(() => setPlayBlocked(true));
              }}
            >
              <span aria-hidden="true">▶</span>
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

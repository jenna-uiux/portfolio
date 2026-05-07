"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./MemoryStrip.module.css";

type Props = {
  images: string[];
  /** Flush bottom dock — removes extra top margin (IslandScene footer rail). */
  dock?: boolean;
};

/** Horizontal drift speed (px/s) — calm continuous marquee */
const MARQUEE_SPEED = 22;

/** One copy width: distance from first tile to first tile of duplicate set (subpixel-safe). */
function getMarqueeLoopWidth(track: HTMLElement): number {
  const n = track.children.length;
  if (n < 4) return Math.max(track.scrollWidth / 2, 1);
  const mid = n / 2;
  const first = track.children[0] as HTMLElement;
  const loopStart = track.children[mid] as HTMLElement;
  const loop =
    loopStart.getBoundingClientRect().left -
    first.getBoundingClientRect().left;
  return loop > 2 ? loop : track.scrollWidth / 2;
}

export function MemoryStrip({ images, dock }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tilesRef = useRef<HTMLDivElement[]>([]);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);

  const setTile = (el: HTMLDivElement | null, i: number) => {
    if (el) tilesRef.current[i] = el;
  };

  const updateActive = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const center =
      viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    tilesRef.current.forEach((tile, i) => {
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    tilesRef.current.forEach((tile, i) => {
      if (!tile) return;
      tile.classList.toggle(s.active, i === bestIdx);
    });
  }, []);

  const killMarquee = useCallback(() => {
    marqueeTweenRef.current?.kill();
    marqueeTweenRef.current = null;
  }, []);

  const startMarquee = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    killMarquee();

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(track, { x: 0 });
      return;
    }

    const loopWidth = getMarqueeLoopWidth(track);
    if (!Number.isFinite(loopWidth) || loopWidth < 8) return;

    // Keep current position when restarting (resize/layout changes) to avoid visible "snap".
    const currentX = Number(gsap.getProperty(track, "x")) || 0;
    const wrappedX = gsap.utils.wrap(-loopWidth, 0, currentX);
    gsap.set(track, { x: wrappedX });
    const duration = loopWidth / MARQUEE_SPEED;

    marqueeTweenRef.current = gsap.fromTo(
      track,
      { x: wrappedX },
      {
        x: wrappedX - loopWidth,
        duration,
        ease: "none",
        repeat: -1,
      }
    );
  }, [killMarquee]);

  const imagesKey = images.join("|");

  useGSAP(
    () => {
      gsap.fromTo(
        `.${s.tile}`,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.15,
          onComplete: () => {
            updateActive();
            requestAnimationFrame(() => requestAnimationFrame(startMarquee));
          },
        }
      );

      let resizeRaf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => startMarquee());
      });
      if (trackRef.current) ro.observe(trackRef.current);

      window.addEventListener("resize", startMarquee);

      let rafId = 0;
      const tick = () => {
        updateActive();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      const viewport = viewportRef.current;
      const pause = () => marqueeTweenRef.current?.pause();
      const resume = () => marqueeTweenRef.current?.resume();
      viewport?.addEventListener("mouseenter", pause);
      viewport?.addEventListener("mouseleave", resume);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", startMarquee);
        cancelAnimationFrame(resizeRaf);
        cancelAnimationFrame(rafId);
        viewport?.removeEventListener("mouseenter", pause);
        viewport?.removeEventListener("mouseleave", resume);
        killMarquee();
      };
    },
    {
      scope: wrapRef,
      dependencies: [imagesKey, startMarquee, updateActive, killMarquee],
    }
  );

  const dupKeys = [0, 1] as const;

  return (
    <div
      ref={wrapRef}
      className={[s.wrap, dock ? s.dock : ""].filter(Boolean).join(" ")}
    >
      <div ref={viewportRef} className={s.viewport}>
        <div ref={trackRef} className={s.track}>
          {dupKeys.flatMap((dup) =>
            images.map((src, i) => {
              const globalIdx = dup * images.length + i;
              return (
                <div
                  key={`${dup}-${src}-${i}-${imagesKey}`}
                  ref={(el) => setTile(el, globalIdx)}
                  className={s.tile}
                  aria-hidden={dup === 1}
                  {...(dup === 0
                    ? { "aria-label": `Memory ${i + 1}` }
                    : {})}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

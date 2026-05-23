"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type BackgroundPinnedSlide = {
  src: string;
  alt: string;
  headline: string;
  body?: string;
  source?: string;
  overlay?: number;
  align?: "center" | "left-bottom";
};

const HEADLINE_FONT = "clamp(18px, 2.35vw, 26px)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

function DeckEyebrow({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <h3
      className={[
        "m-0 max-w-[95%] text-[clamp(22px,4.2vw,36px)] font-medium leading-[1.12] tracking-[-0.02em] text-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </h3>
  );
}

function renderHeadline(text: string) {
  return text.split("\n").map((line, lineIdx) => (
    <span
      key={lineIdx}
      style={{
        display: "block",
        marginTop: lineIdx === 0 ? 0 : "0.1em",
        lineHeight: 1.18,
      }}
    >
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} style={{ color: "rgba(255,255,255,1)" }}>
              {part.slice(2, -2)}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: "rgba(205,205,205,0.95)" }}>
            {part}
          </span>
        );
      })}
    </span>
  ));
}

function SlideLayer({
  slide,
  imagePriority,
}: {
  slide: BackgroundPinnedSlide;
  imagePriority?: boolean;
}) {
  const overlay = slide.overlay ?? 0.55;
  const align = slide.align ?? "center";

  return (
    <div className="absolute inset-0 overflow-hidden rounded-sm border border-white/[0.08]">
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 80vw, 100vw"
        priority={imagePriority ?? false}
      />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${overlay})` }}
      />

      {slide.headline ? (
        <div
          className={
            align === "center"
              ? "absolute inset-0 flex items-center justify-center px-8"
              : "absolute bottom-6 left-6 right-10 md:bottom-10 md:left-10 md:right-12"
          }
        >
          {align === "left-bottom" ? (
            <div>
              <p
                className="max-w-[36ch]"
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontSize: HEADLINE_FONT,
                  fontWeight: 350,
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                  textShadow: "0 0 18px rgba(0,0,0,0.55)",
                }}
              >
                {renderHeadline(slide.headline)}
              </p>
              {slide.body ? (
                <p
                  className="mt-4 max-w-[46ch] text-[12px] leading-relaxed md:text-[13px]"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  {slide.body}
                </p>
              ) : null}
            </div>
          ) : (
            <p
              className={[
                "max-w-[36ch]",
                align === "center" ? "text-center" : "",
              ].join(" ")}
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: HEADLINE_FONT,
                fontWeight: 350,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                textShadow: "0 0 18px rgba(0,0,0,0.55)",
              }}
            >
              {renderHeadline(slide.headline)}
            </p>
          )}
        </div>
      ) : null}

      {slide.body && align === "center" ? (
        <div className="absolute bottom-6 left-6 max-w-[42ch] md:bottom-10 md:left-10">
          <p
            className="text-[12px] leading-relaxed md:text-[13px]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {slide.body}
          </p>
        </div>
      ) : null}

      {slide.source ? (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8">
          <p
            className="text-[10px] tracking-wide"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {slide.source}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Scroll-pinned deck: scrub through three full-bleed statements (GSAP ScrollTrigger).
 * `prefers-reduced-motion`: static vertical stack, no pin.
 */
export function BackgroundPinnedDeck({
  slides,
  kicker,
  eyebrow,
}: {
  slides: BackgroundPinnedSlide[];
  kicker?: string;
  eyebrow?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (reduced) return;
      const wrap = wrapRef.current;
      const pin = pinRef.current;
      if (!wrap || !pin || slides.length === 0) return;

      const layers = slideRefs.current.filter(Boolean) as HTMLDivElement[];
      if (layers.length === 0) return;

      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(layers[0], { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          pin: pin,
          start: "top 88px",
          end: () => "+=" + Math.round(window.innerHeight * 2.35),
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const n = layers.length;
      for (let i = 0; i < n - 1; i++) {
        const cross = (i + 1) / n - 0.07;
        tl.to(
          layers[i],
          { autoAlpha: 0, duration: 0.14, ease: "none" },
          cross
        );
        tl.to(
          layers[i + 1],
          { autoAlpha: 1, duration: 0.14, ease: "none" },
          cross
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: wrapRef, dependencies: [reduced, slides.length] }
  );

  if (reduced) {
    return (
      <div className="not-prose space-y-6">
        {kicker || eyebrow ? (
          <div className="flex flex-col gap-1">
            {kicker ? (
              <p className="t-eyebrow m-0 whitespace-nowrap">{kicker}</p>
            ) : null}
            {eyebrow ? <DeckEyebrow>{eyebrow}</DeckEyebrow> : null}
          </div>
        ) : null}
        {slides.map((s, i) => (
          <div key={i} className="relative aspect-[16/9] w-full">
            <SlideLayer slide={s} imagePriority={i === 0} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="not-prose relative w-full">
      <div
        ref={pinRef}
        className="relative flex min-h-[min(72dvh,640px)] w-full flex-col justify-center py-6 md:py-10"
      >
        {kicker || eyebrow ? (
          <div className="mb-2.5 flex shrink-0 flex-col gap-0.5 md:mb-3 md:gap-1">
            {kicker ? (
              <p className="t-eyebrow m-0 whitespace-nowrap">{kicker}</p>
            ) : null}
            {eyebrow ? <DeckEyebrow>{eyebrow}</DeckEyebrow> : null}
          </div>
        ) : null}
        <div className="relative aspect-[16/9] w-full shrink-0">
          {slides.map((slide, i) => (
            <div
              key={i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="absolute inset-0"
            >
              <SlideLayer slide={slide} imagePriority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

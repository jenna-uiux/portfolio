"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RichText } from "./CaseStudyBlocks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  filled: number;
  total: number;
  /** Use `==text==` to mark the portion that should render as the hero stat number. */
  headline: string;
  subtext?: string;
};

export function StatDots({ filled, total, headline, subtext }: Props) {
  const root = useRef<HTMLDivElement>(null);

  const match = headline.match(/^(.*?)==([^=]+)==(.*)$/s);
  const hero = match?.[2]?.trim() ?? "";
  const trailing = match
    ? [match[1], match[3]].join(" ").replace(/\s+/g, " ").trim()
    : headline.trim();
  const sr = headline.replace(/==/g, "");

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const setFinal = () => {
        gsap.set("[data-dot]", { scale: 1, autoAlpha: 1 });
        gsap.set("[data-dot-fill]", { autoAlpha: 1, scale: 1 });
        gsap.set("[data-hero]", { autoAlpha: 1, y: 0 });
        gsap.set("[data-trailing]", { autoAlpha: 1, y: 0 });
        gsap.set("[data-subtext]", { autoAlpha: 1, y: 0 });
      };

      if (reduced) {
        setFinal();
        return;
      }

      gsap.set("[data-dot]", {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center",
      });
      gsap.set("[data-dot-fill]", { autoAlpha: 0, scale: 1 });
      gsap.set("[data-hero]", { autoAlpha: 0, y: 14 });
      gsap.set("[data-trailing]", { autoAlpha: 0, y: 8 });
      gsap.set("[data-subtext]", { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none reset",
        },
        defaults: { ease: "power2.out" },
      });

      tl.to("[data-dot]", {
        scale: 1,
        autoAlpha: 1,
        duration: 0.32,
        stagger: 0.06,
      })
        .to(
          "[data-dot-fill]",
          { autoAlpha: 1, duration: 0.32 },
          "+=0.08"
        )
        .to(
          "[data-dot-fill]",
          {
            scale: 1.08,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
          "<"
        )
        .to(
          "[data-hero]",
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.15"
        )
        .to(
          "[data-trailing]",
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.35"
        )
        .to(
          "[data-subtext]",
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
    },
    { scope: root }
  );

  return (
    <aside
      ref={root}
      className="rounded-2xl border border-ink/10 bg-white/35 px-5 py-5 md:px-7 md:py-6"
      aria-label={sr}
    >
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:items-center">
        <div>
          <p className="t-eyebrow-mut">Filing risk signal</p>
          <div className="mt-4 flex items-center gap-2.5" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => {
              const isFilled = i < filled;
              return (
                <span
                  key={i}
                  data-dot
                  className="relative block h-5 w-5 rounded-full md:h-6 md:w-6"
                  style={{ background: "var(--accent-soft)" }}
                >
                  {isFilled ? (
                    <span
                      data-dot-fill
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          {hero ? (
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <div
                data-hero
                className="font-light leading-none tracking-[-0.045em] text-[clamp(44px,6vw,72px)]"
                style={{ color: "var(--accent)" }}
              >
                {hero}
              </div>
              {trailing ? (
                <p
                  data-trailing
                  className="max-w-[30ch] text-[16px] font-light leading-[1.45] text-ink md:text-[18px]"
                >
                  <RichText text={trailing} />
                </p>
              ) : null}
            </div>
          ) : (
            <p data-trailing className="max-w-[40ch] t-h4">
              <RichText text={trailing} />
            </p>
          )}

          {subtext ? (
            <p data-subtext className="mt-4 max-w-[48ch] t-body-sm">
              <RichText text={subtext} />
            </p>
          ) : null}
        </div>
      </div>

      <span className="sr-only">
        {filled} out of {total}. {sr}
      </span>
    </aside>
  );
}

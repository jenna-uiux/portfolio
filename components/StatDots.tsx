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
  const hasHero = Boolean(hero);
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
        duration: 0.4,
        stagger: 0.08,
      })
        .to(
          "[data-dot-fill]",
          { autoAlpha: 1, duration: 0.45 },
          "+=0.18"
        )
        .to(
          "[data-dot-fill]",
          {
            scale: 1.18,
            duration: 0.22,
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
    <div ref={root} className="border-t hairline pt-10">
      <div
        className="flex items-center gap-3 md:gap-4"
        aria-hidden="true"
      >
        {Array.from({ length: total }, (_, i) => {
          const isFilled = i < filled;
          return (
            <span
              key={i}
              data-dot
              className="relative block h-12 w-12 rounded-full md:h-14 md:w-14"
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

      {hasHero ? (
        <div className="mt-10 grid items-end gap-x-10 gap-y-5 md:grid-cols-[auto_1fr]">
          <div
            data-hero
            className="font-light leading-[0.88] tracking-[-0.045em] text-[clamp(64px,10vw,128px)]"
            style={{ color: "var(--accent)" }}
          >
            {hero}
          </div>
          {trailing ? (
            <p
              data-trailing
              className="max-w-[34ch] text-[clamp(17px,1.7vw,21px)] font-light leading-[1.4] text-ink"
            >
              <RichText text={trailing} />
            </p>
          ) : null}
        </div>
      ) : (
        <p
          data-trailing
          className="mt-10 max-w-[40ch] text-[clamp(20px,2vw,28px)] font-light leading-[1.35] text-ink"
        >
          <RichText text={trailing} />
        </p>
      )}

      {subtext ? (
        <p
          data-subtext
          className="mt-7 max-w-[52ch] t-body-sm"
        >
          <RichText text={subtext} />
        </p>
      ) : null}

      <span className="sr-only">
        {filled} out of {total}. {sr}
      </span>
    </div>
  );
}

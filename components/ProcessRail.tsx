"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ImageSlot } from "./ImageSlot";
import { MediaImage } from "./MediaImage";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Step = { num: string; name: string };
type RailImage = { filename: string; description: string; src?: string };

type Props = {
  steps: Step[];
  image: RailImage;
};

export function ProcessRail({ steps, image }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const setFinal = () => {
        gsap.set("[data-rail]", { scaleY: 1 });
        gsap.set("[data-node]", { scale: 1, autoAlpha: 1 });
        gsap.set("[data-node-fill]", { autoAlpha: 1, scale: 1 });
        gsap.set("[data-num]", { color: "var(--accent)" });
        gsap.set("[data-step]", { autoAlpha: 1, x: 0 });
        gsap.set("[data-image]", { autoAlpha: 1, scale: 1 });
      };

      if (reduced) {
        setFinal();
        return;
      }

      gsap.set("[data-rail]", { scaleY: 0, transformOrigin: "top center" });
      gsap.set("[data-node]", {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center",
      });
      gsap.set("[data-node-fill]", { autoAlpha: 0, scale: 1 });
      gsap.set("[data-num]", { color: "var(--muted)" });
      gsap.set("[data-step]", { autoAlpha: 0, x: 8 });
      gsap.set("[data-image]", { autoAlpha: 0, scale: 0.985 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none reset",
        },
        defaults: { ease: "power2.out" },
      });

      tl.to(
        "[data-image]",
        { autoAlpha: 1, scale: 1, duration: 0.7 },
        0
      );

      const railStart = 0.15;
      const railDuration = 1.4;

      tl.to(
        "[data-rail]",
        { scaleY: 1, duration: railDuration, ease: "power1.inOut" },
        railStart
      );

      const last = Math.max(1, steps.length - 1);
      steps.forEach((_, i) => {
        const at = railStart + (i / last) * railDuration * 0.95;
        tl.to(
          `[data-node="${i}"]`,
          { scale: 1, autoAlpha: 1, duration: 0.32 },
          at
        )
          .to(
            `[data-node-fill="${i}"]`,
            { autoAlpha: 1, duration: 0.28 },
            at + 0.04
          )
          .to(
            `[data-node-fill="${i}"]`,
            {
              scale: 1.35,
              duration: 0.18,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            },
            at + 0.06
          )
          .to(
            `[data-num="${i}"]`,
            { color: "var(--accent)", duration: 0.3 },
            at + 0.05
          )
          .to(
            `[data-step="${i}"]`,
            { autoAlpha: 1, x: 0, duration: 0.4 },
            at + 0.08
          );
      });
    },
    { scope: root, dependencies: [steps.length] }
  );

  return (
    <div ref={root} className="border-t hairline pt-10">
      <div className="grid items-start gap-x-10 gap-y-12 md:grid-cols-[5fr_7fr]">
        <ol className="relative space-y-1">
          <span
            data-rail
            aria-hidden
            className="absolute left-[7px] top-4 bottom-4 w-px"
            style={{ background: "var(--accent-soft)" }}
          />
          {steps.map((step, i) => (
            <li key={i} className="relative z-10 flex items-center gap-5 py-3">
              <span
                aria-hidden
                className="relative block h-[15px] w-[15px] shrink-0"
              >
                <span
                  data-node={i}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--accent-soft)" }}
                >
                  <span
                    data-node-fill={i}
                    className="absolute inset-[3px] rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                </span>
              </span>
              <span
                data-num={i}
                className="t-mono shrink-0 tabular-nums"
                style={{ color: "var(--muted)" }}
              >
                {step.num}
              </span>
              <span
                data-step={i}
                className="text-[clamp(15px,1.6vw,18px)] font-medium leading-[1.3] text-ink"
              >
                {step.name}
              </span>
            </li>
          ))}
        </ol>

        <div data-image className="md:pt-2">
          {image.src ? (
            <MediaImage
              src={image.src}
              alt={image.description}
              ratio="16/9"
              fallbackHint={image.src}
            />
          ) : (
            <ImageSlot
              filename={image.filename}
              description={image.description}
              ratio="16/9"
            />
          )}
        </div>
      </div>
    </div>
  );
}

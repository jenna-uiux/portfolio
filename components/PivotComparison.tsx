"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RichText } from "./CaseStudyBlocks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type PivotItem = {
  label: string;
  title: string;
  body: string;
};

type Props = {
  items: [PivotItem, PivotItem];
};

const highlightStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(transparent 70%, var(--accent-soft) 70%)",
  backgroundSize: "var(--hl, 0%) 100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 0",
  padding: "0 4px",
  margin: "0 -4px",
};

export function PivotComparison({ items }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [problem, decision] = items;

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const setFinal = () => {
        gsap.set("[data-col='v1']", { autoAlpha: 1, y: 0 });
        gsap.set("[data-col='v2']", { autoAlpha: 1, x: 0 });
        gsap.set("[data-arrow]", { scaleX: 1, autoAlpha: 1 });
        gsap.set("[data-decision-label]", { "--hl": "100%" });
      };

      if (reduced) {
        setFinal();
        return;
      }

      gsap.set("[data-col='v1']", { autoAlpha: 0, y: 14 });
      gsap.set("[data-col='v2']", { autoAlpha: 0, x: 18 });
      gsap.set("[data-arrow]", { scaleX: 0, autoAlpha: 0, transformOrigin: "left center" });
      gsap.set("[data-decision-label]", { "--hl": "0%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none reset",
        },
        defaults: { ease: "power2.out" },
      });

      tl.to("[data-col='v1']", { autoAlpha: 1, y: 0, duration: 0.55 })
        .to(
          "[data-arrow]",
          { autoAlpha: 1, scaleX: 1, duration: 0.45 },
          "-=0.15"
        )
        .to(
          "[data-col='v2']",
          { autoAlpha: 1, x: 0, duration: 0.55 },
          "-=0.25"
        )
        .to(
          "[data-decision-label]",
          { "--hl": "100%", duration: 0.45 },
          "-=0.2"
        );
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="relative grid items-start gap-x-12 gap-y-10 border-t hairline pt-8 md:grid-cols-[1fr_auto_1fr]"
    >
      <div data-col="v1" className="min-w-0">
        <p className="t-eyebrow-mut">{problem.label}</p>
        <h3 className="mt-4 max-w-[18ch] t-h3">
          <RichText text={problem.title} />
        </h3>
        <p className="mt-4 max-w-[36ch] t-body-sm">
          <RichText text={problem.body} />
        </p>
      </div>

      <div
        data-arrow
        aria-hidden
        className="hidden self-start pt-[2.1rem] md:block"
        style={{ color: "var(--accent)" }}
      >
        <svg
          width="44"
          height="10"
          viewBox="0 0 44 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 5 H40"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M36 1 L42 5 L36 9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <div data-col="v2" className="min-w-0">
        <p data-decision-label className="t-eyebrow inline-block" style={highlightStyle}>
          {decision.label}
        </p>
        <h3 className="mt-4 max-w-[18ch] t-h3">
          <RichText text={decision.title} />
        </h3>
        <p className="mt-4 max-w-[36ch] t-body-sm">
          <RichText text={decision.body} />
        </p>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const METRICS = [
  { value: 1.95, label: "Pragmatic Quality" },
  { value: 1.75, label: "Hedonic Quality" },
] as const;

function formatScore(value: number) {
  const abs = Math.abs(value).toFixed(2);
  return `${value >= 0 ? "+" : "\u2212"}${abs}`;
}

export function AeonOutcomeProof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        root,
        { autoAlpha: reduced ? 1 : 0, y: reduced ? 0 : 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0 : 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      METRICS.forEach((metric, i) => {
        const numberEl = numberRefs.current[i];
        if (!numberEl) return;

        if (reduced) {
          numberEl.textContent = formatScore(metric.value);
          return;
        }

        const state = { v: 0 };
        gsap.to(state, {
          v: metric.value,
          duration: 1.2,
          delay: 0.1 + i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            numberEl.textContent = formatScore(state.v);
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="not-prose grid overflow-hidden border border-white/15 md:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.55fr)]"
    >
      <div className="flex min-h-0 flex-col border-b border-white/15 md:border-b-0 md:border-r">
        <div className="flex min-h-12 items-center border-b border-white/15 px-4 t-eyebrow-mut">
          <span>
            Adapted UEQ-S evaluation
            <span className="normal-case">, n=20</span>
          </span>
        </div>

        <ul className="grid flex-1 grid-rows-2">
          {METRICS.map((metric, i) => (
            <li
              key={metric.label}
              className="flex flex-col justify-center border-b border-white/15 px-4 py-6 last:border-b-0 md:px-5"
            >
              <p
                className="text-[clamp(48px,6.4vw,80px)] font-light leading-none tracking-[-0.045em] text-ink"
                style={{ fontFamily: '"Instrument Serif", serif' }}
              >
                <span
                  ref={(el) => {
                    numberRefs.current[i] = el;
                  }}
                >
                  +0.00
                </span>
              </p>
              <p className="mt-3 text-[15px] font-medium tracking-[-0.02em] text-ink md:text-[16px]">
                {metric.label}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <figure className="group m-0 min-w-0">
        <div className="relative overflow-hidden">
          <Image
            src="/images/aeon/outcome/aeon_impact.jpg"
            alt="Presenting AEON’s proof of concept to Autodesk’s EMEA Automotive Team"
            width={3112}
            height={2266}
            className="h-auto w-full origin-center scale-[1.01] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-[1.01]"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>
      </figure>
    </div>
  );
}

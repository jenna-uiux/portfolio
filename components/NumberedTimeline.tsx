"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RichText } from "./CaseStudyBlocks";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type TimelineStep = {
  num: string;
  name: string;
  note?: string;
  tag?: string;
};

type Props = {
  steps: TimelineStep[];
};

export function NumberedTimeline({ steps }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const line = el.querySelector<HTMLElement>("[data-line]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", el);
      const items = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const mobileItems = gsap.utils.toArray<HTMLElement>("[data-step-m]", el);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        if (line) gsap.set(line, { scaleX: 1 });
        gsap.set([...dots, ...items, ...mobileItems], {
          scale: 1,
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      if (line && items.length > 0) {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(dots, { scale: 0, transformOrigin: "center center" });
        gsap.set(items, { autoAlpha: 0, y: 16 });

        const drawDuration = 1.6;
        const per = drawDuration / Math.max(steps.length, 1);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reset",
          },
        });

        tl.to(
          line,
          { scaleX: 1, duration: drawDuration, ease: "power2.inOut" },
          0
        );

        items.forEach((item, i) => {
          const at = i * per;
          if (dots[i]) {
            tl.to(
              dots[i],
              { scale: 1, duration: 0.35, ease: "back.out(2.5)" },
              at
            );
          }
          tl.to(item, { autoAlpha: 1, y: 0, duration: 0.55 }, at + 0.1);
        });
      }

      if (mobileItems.length > 0) {
        gsap.set(mobileItems, { autoAlpha: 0, y: 12 });
        gsap.to(mobileItems, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        });
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="numbered-timeline mt-8">
      {/* Desktop: horizontal left-to-right timeline */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[5px] h-px bg-ink/10" />
          <div
            data-line
            className="absolute left-0 right-0 top-[5px] h-px"
            style={{ background: "var(--accent)" }}
          />
          <ol
            className="grid gap-x-8"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step) => (
              <li key={step.num} className="relative pt-9">
                <span
                  data-dot
                  aria-hidden
                  className="absolute left-0 top-0 block h-[11px] w-[11px] rounded-full border-2"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--bg)",
                  }}
                />
                <div data-step>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="t-mono tabular-nums"
                      style={{ color: "var(--accent)" }}
                    >
                      {step.num}
                    </span>
                    {step.tag ? (
                      <span className="t-mono text-ink/40">{step.tag}</span>
                    ) : null}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
                    {step.name}
                  </p>
                  {step.note ? (
                    <p className="mt-3 t-body-sm">
                      <RichText text={step.note} />
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile: vertical stacked rows */}
      <ol className="divide-y hairline border-y hairline md:hidden">
        {steps.map((step) => (
          <li
            key={step.num}
            data-step-m
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 py-5"
          >
            <span
              className="t-mono shrink-0 tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {step.num}
            </span>
            <div>
              {step.tag ? (
                <p className="t-mono text-ink/40">{step.tag}</p>
              ) : null}
              <p className="mt-1 whitespace-pre-line t-h4 font-normal text-ink">
                {step.name}
              </p>
              {step.note ? (
                <p className="mt-2 t-body-sm">
                  <RichText text={step.note} />
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

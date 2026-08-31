"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { RichText } from "./CaseStudyBlocks";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ProcessStepImage = {
  src: string;
  alt: string;
  caption?: string;
  body?: string;
  width: number;
  height: number;
  fit?: "cover" | "contain";
};

export type ProcessStep = {
  num: string;
  title: string;
  body: string;
  overview?: {
    label: string;
    output: string;
    tools: string[];
  };
  layout?: "stacked" | "asymmetric" | "photoPair" | "single";
  images?: ProcessStepImage[];
};

type Props = {
  steps: ProcessStep[];
};

function Artifact({
  image,
  sizes,
  className = "",
  fill = false,
}: {
  image: ProcessStepImage;
  sizes: string;
  className?: string;
  /** Photos fill a fixed-height frame; text artifacts keep intrinsic sizing. */
  fill?: boolean;
}) {
  const frame = [
    "overflow-hidden rounded-lg border border-ink/10 bg-white",
    className,
  ].join(" ");

  if (fill) {
    return (
      <div className={`relative ${frame}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className={image.fit === "cover" ? "object-cover" : "object-contain"}
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-3 t-caption">{text}</p>;
}

function StepCopy({ step }: { step: ProcessStep }) {
  return (
    <>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
        {step.num}
      </span>
      <h3 className="mt-2 t-h3">{step.title}</h3>
      <div className="mt-3 prose-rhythm t-body">
        {step.body
          .split("\n\n")
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>
              <RichText text={para} />
            </p>
          ))}
      </div>
    </>
  );
}

function ProcessOverview({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const overviewSteps = steps.filter((step) => step.overview);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const progressLine = root.querySelector<HTMLElement>(
        desktop ? "[data-desktop-progress]" : "[data-mobile-progress]"
      );
      const mainItems = gsap.utils.toArray<HTMLElement>(
        desktop ? "[data-desktop-main]" : "[data-mobile-main]",
        root
      );
      const metaItems = gsap.utils.toArray<HTMLElement>(
        desktop ? "[data-desktop-meta]" : "[data-mobile-meta]",
        root
      );
      const dots = gsap.utils.toArray<HTMLElement>(
        desktop ? "[data-desktop-dot]" : "[data-mobile-dot]",
        root
      );

      if (reducedMotion) {
        gsap.set([progressLine, ...mainItems, ...metaItems, ...dots].filter(Boolean), {
          clearProps: "all",
          autoAlpha: 1,
          scale: 1,
          y: 0,
        });
        return;
      }

      if (progressLine) {
        gsap.set(progressLine, {
          scaleX: desktop ? 0 : 1,
          scaleY: desktop ? 1 : 0,
          transformOrigin: desktop ? "left center" : "center top",
        });
      }
      gsap.set(dots, { scale: 0, transformOrigin: "center center" });
      gsap.set(mainItems, { autoAlpha: 0, y: 10 });
      gsap.set(metaItems, { autoAlpha: 0, y: 6 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
      });

      const revealNode = (index: number, at: number) => {
        const dot = dots[index];
        if (!dot) return;
        timeline
          .to(
            dot,
            {
              scale: 1,
              backgroundColor: "var(--accent-orange)",
              duration: 0.28,
              ease: "back.out(2.2)",
            },
            at
          )
          .to(
            dot,
            { backgroundColor: "var(--bg)", duration: 0.32 },
            at + 0.2
          );
        if (mainItems[index]) {
          timeline.to(
            mainItems[index],
            { autoAlpha: 1, y: 0, duration: 0.48 },
            at + 0.1
          );
        }
        if (metaItems[index]) {
          timeline.to(
            metaItems[index],
            { autoAlpha: 1, y: 0, duration: 0.4 },
            at + 0.34
          );
        }
      };

      revealNode(0, 0);

      const segmentStarts = [0.78, 1.76, 2.74];
      const lineDuration = 3.35;

      if (progressLine) {
        timeline.to(
          progressLine,
          desktop
            ? { scaleX: 1, duration: lineDuration, ease: "power1.inOut" }
            : { scaleY: 1, duration: lineDuration, ease: "power1.inOut" },
          0
        );
      }

      segmentStarts.forEach((segmentStart, index) => {
        revealNode(index + 1, segmentStart + 0.58);
      });
    },
    { scope: ref }
  );

  if (overviewSteps.length === 0) return null;

  return (
    <div ref={ref} className="pb-7 md:pb-9">
      <div className="relative hidden md:block">
        <span
          aria-hidden
          className="absolute left-[5px] right-0 top-[5px] h-px bg-ink/10"
        />
        <span
          data-desktop-progress
          aria-hidden
          className="absolute left-[5px] right-0 top-[5px] h-px bg-[color:var(--accent-orange)]"
        />
        <ol className="grid grid-cols-4">
          {overviewSteps.map((step) => (
            <li
              key={step.num}
              className="relative pr-8 pt-8 last:pr-0"
            >
              <span
                data-desktop-dot
                aria-hidden
                className="absolute left-0 top-0 z-10 h-[11px] w-[11px] rounded-full border-2 border-[color:var(--accent-orange)] bg-[color:var(--bg)]"
              />
              <div data-desktop-main>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
                  {step.num}
                </p>
                <h3 className="mt-2 text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
                  {step.overview?.label}
                </h3>
                <p className="mt-2 t-body-sm">{step.overview?.output}</p>
              </div>
              <p data-desktop-meta className="mt-4 t-caption">
                {step.overview?.tools.join(" · ")}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative md:hidden">
        <span
          aria-hidden
          className="absolute bottom-[5px] left-[5px] top-[5px] w-px bg-ink/10"
        />
        <span
          data-mobile-progress
          aria-hidden
          className="absolute bottom-[5px] left-[5px] top-[5px] w-px bg-[color:var(--accent-orange)]"
        />
        <ol className="ml-[5px] space-y-8 pl-6">
          {overviewSteps.map((step) => (
            <li key={step.num} className="relative">
              <span
                data-mobile-dot
                aria-hidden
                className="absolute -left-[30px] top-[3px] z-10 h-[11px] w-[11px] rounded-full border-2 border-[color:var(--accent-orange)] bg-[color:var(--bg)]"
              />
              <div data-mobile-main>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
                  {step.num}
                </p>
                <h3 className="mt-1 text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
                  {step.overview?.label}
                </h3>
                <p className="mt-1 t-body-sm">{step.overview?.output}</p>
              </div>
              <p data-mobile-meta className="mt-2 t-caption">
                {step.overview?.tools.join(" · ")}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StepArtifacts({ step }: { step: ProcessStep }) {
  const images = step.images;
  if (!images || images.length === 0) return null;

  const [primary, supporting] = images;
  const layout = step.layout ?? "single";

  if (layout === "stacked") {
    return (
      <div className="mt-8 md:mt-10">
        <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-9">
            <Artifact
              image={primary}
              sizes="(min-width: 768px) 54vw, 100vw"
            />
          </div>
          <div className="md:col-span-3">
            <p className="max-w-[30ch] t-caption">{primary.caption}</p>
          </div>
        </div>

        {supporting ? (
          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-12 md:items-end md:gap-8">
            <div className="md:col-span-7">
              <Artifact
                image={supporting}
                sizes="(min-width: 768px) 42vw, 100vw"
              />
            </div>
            <div className="md:col-span-5">
              <p className="max-w-[34ch] t-caption">{supporting.caption}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "asymmetric") {
    return (
      <div className="mt-8 md:mt-10">
        <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <Artifact image={primary} sizes="(min-width: 768px) 48vw, 100vw" />
          </div>
          <div className="md:col-span-4">
            <p className="max-w-[30ch] t-caption">{primary.caption}</p>
          </div>
        </div>
        {primary.body ? (
          <p className="mt-10 t-body md:mt-12">
            <RichText text={primary.body} />
          </p>
        ) : null}

        {supporting ? (
          <div className="mt-10 flex flex-col gap-4 md:mt-12 md:flex-row md:items-end md:gap-5">
            <p className="order-2 max-w-[30ch] shrink-0 t-caption md:order-1">
              {supporting.caption}
            </p>
            <div className="order-1 min-w-0 flex-1 md:order-2">
              <Artifact
                image={supporting}
                sizes="(min-width: 768px) 48vw, 100vw"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (layout === "photoPair") {
    return (
      <div className="mt-8 md:mt-10">
        <div className="grid gap-7 md:grid-cols-12 md:items-stretch md:gap-7">
          <div className="md:col-span-5">
            <Artifact
              image={primary}
              sizes="(min-width: 768px) 30vw, 100vw"
              className="h-[280px] md:h-[320px]"
              fill
            />
            <Caption text={primary.caption} />
          </div>
          {supporting ? (
            <div className="flex flex-col md:col-span-7">
              <Artifact
                image={{ ...supporting, fit: supporting.fit ?? "cover" }}
                sizes="(min-width: 768px) 42vw, 100vw"
                className="h-[280px] md:h-[320px]"
                fill
              />
              <Caption text={supporting.caption} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-10">
      <Artifact image={primary} sizes="(min-width: 768px) 72vw, 100vw" />
      <Caption text={primary.caption} />
    </div>
  );
}

export function ProcessSteps({ steps }: Props) {
  return (
    <>
      <ProcessOverview steps={steps} />

      <ol className="mt-[clamp(64px,7vw,96px)]">
        {steps.map((step, index) => {
          const dividerClass =
            index > 0
              ? "mt-[clamp(72px,7vw,112px)] border-t border-ink/10 pt-[clamp(48px,5vw,72px)]"
              : "";

          if (step.layout === "single" && step.images?.[0]) {
            const image = step.images[0];
            return (
              <li
                key={step.num}
                className={`${dividerClass} grid gap-8 md:grid-cols-12 md:items-center md:gap-10`}
              >
                <div className="md:col-span-5">
                  <StepCopy step={step} />
                </div>
                <div className="md:col-span-7">
                  <Artifact
                    image={image}
                    sizes="(min-width: 768px) 42vw, 100vw"
                  />
                  <Caption text={image.caption} />
                </div>
              </li>
            );
          }

          return (
            <li key={step.num} className={dividerClass}>
              <StepCopy step={step} />
              <StepArtifacts step={step} />
            </li>
          );
        })}
      </ol>
    </>
  );
}

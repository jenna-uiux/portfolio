"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MODES = [
  {
    id: "road",
    label: "Road mode",
    src: "/images/aeon/final/HUD_Design_Final_road.jpg",
    alt: "AEON cockpit in road mode, with traffic alerts and an alternate water route on the HUD",
    accent: "#d0893a",
  },
  {
    id: "water",
    label: "Water mode",
    src: "/images/aeon/final/HUD_Design_Final_water.jpg",
    alt: "AEON cockpit in water mode, with heading, stability, and visual motion cues on the HUD",
    accent: "#7cc2ff",
  },
] as const;

const VEHICLE_FIGURES = [
  {
    src: "/images/aeon/final/final_3_1.jpg",
    alt: "Front studio render of AEON",
    width: 3072,
    height: 1317,
  },
  {
    src: "/images/aeon/final/final_3_2.jpg",
    alt: "AEON exterior detail collage — front, lights, cameras, wheels, and rear",
    width: 3072,
    height: 2048,
  },
  {
    src: "/images/aeon/final/final_3_3.jpg",
    alt: "AEON road-mode cabin and HUD collage",
    width: 3072,
    height: 1729,
  },
  {
    src: "/images/aeon/final/final_4_1.jpg",
    alt: "AEON on water with the gull-wing door open and seat extended for boarding",
    width: 3072,
    height: 1792,
  },
  {
    src: "/images/aeon/final/Final_4_2.jpg",
    alt: "AEON water-mode exterior detail collage",
    width: 3072,
    height: 1793,
  },
  {
    src: "/images/aeon/final/final_4_3.jpg",
    alt: "AEON water-mode cabin and HUD collage",
    width: 3072,
    height: 1729,
  },
] as const;

export function AeonFinalDesignFigures() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const figures = rootRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!figures?.length) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(figures, { autoAlpha: 1, y: 0 });
        return;
      }

      figures.forEach((figure) => {
        gsap.fromTo(
          figure,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: figure,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="not-prose">
      <FinalModeCompare />
      <div className="mt-20">
        {VEHICLE_FIGURES.map((figure) => (
          <figure
            key={figure.src}
            data-reveal
            className="m-0 p-0 leading-none will-change-transform"
          >
            <Image
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              className="block h-auto w-full"
              sizes="(min-width: 1024px) 80vw, 100vw"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function FinalModeCompare() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = MODES[activeIndex];

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % MODES.length);
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, inView, paused]);

  return (
    <section
      ref={rootRef}
      data-reveal
      className="overflow-hidden rounded-none bg-black will-change-transform"
      aria-label="AEON road and water mode comparison"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative px-1 pb-1 pt-6 sm:px-2">
        <div className="relative grid grid-cols-2">
          {MODES.map((mode, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={mode.id}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="group relative pb-4 text-center"
                aria-pressed={isActive}
              >
                <span
                  className={[
                    "inline-block font-[400] text-[11px] uppercase tracking-[0.08em] transition-colors duration-500 sm:text-[13px]",
                    isActive
                      ? "text-[#e7e7e7]"
                      : "text-white/35 group-hover:text-white/60",
                  ].join(" ")}
                  style={{ fontFamily: "Aspekta, sans-serif" }}
                >
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative mx-1 h-px">
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
          <div
            className="absolute top-0 h-px transition-[left,width,background-color] duration-700 ease-in-out"
            style={{
              left: `${(activeIndex / MODES.length) * 100}%`,
              width: `${100 / MODES.length}%`,
              backgroundColor: active.accent,
            }}
          />
          {MODES.map((mode, index) => (
            <span
              key={mode.id}
              className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-500"
              style={{
                left: `${((index + 0.5) / MODES.length) * 100}%`,
                backgroundColor:
                  index === activeIndex ? mode.accent : "rgba(231, 231, 231, 0.28)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden bg-black">
        {MODES.map((mode, index) => (
          <div
            key={mode.id}
            className={[
              "absolute inset-0 transition-opacity duration-[1100ms] ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={mode.src}
              alt={index === activeIndex ? mode.alt : ""}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 80vw, 100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

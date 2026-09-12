"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MODES = [
  {
    id: "parking",
    label: "Parking mode",
    src: "/images/aeon/ia/modes/parking.jpg",
    accent: "#3a3a3a",
  },
  {
    id: "road",
    label: "Road mode",
    src: "/images/aeon/ia/modes/road.jpg",
    accent: "#d0893a",
  },
  {
    id: "water",
    label: "Water mode",
    src: "/images/aeon/ia/modes/water.jpg",
    accent: "#7cc2ff",
  },
] as const;

export function AeonWireframePanorama() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = MODES[activeIndex];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % MODES.length);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeIndex]);

  return (
    <section
      className="not-prose overflow-hidden rounded-none bg-black"
      aria-label="AEON HMI mode wireframes"
    >
      <div className="relative px-1 pb-1 pt-6 sm:px-2">
        <div className="relative grid grid-cols-3">
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
                    isActive ? "text-[#e7e7e7]" : "text-white/35 group-hover:text-white/60",
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
                  index === activeIndex ? mode.accent : "rgba(231,231,231,0.28)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative aspect-[21/8] overflow-hidden bg-black">
        {MODES.map((mode, index) => (
          <div
            key={mode.id}
            className={[
              "absolute inset-0 transition-opacity duration-[900ms] ease-in-out",
              index === activeIndex ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={mode.src}
              alt={
                index === activeIndex
                  ? `AEON dashboard in ${mode.label}`
                  : ""
              }
              fill
              className="object-cover object-bottom"
              sizes="(min-width: 1024px) 80vw, 100vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

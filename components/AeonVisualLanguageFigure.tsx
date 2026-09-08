"use client";

import Image from "next/image";
import { useState } from "react";

const TYPE_ROWS = [
  {
    label: "Headline 1",
    spec: "56px · 72px · −2%",
    size: "1.25rem",
    tracking: "-0.02em",
  },
  {
    label: "Headline 2",
    spec: "48px · 60px · −2%",
    size: "1.05rem",
    tracking: "-0.02em",
  },
  {
    label: "Body 1",
    spec: "16px · 24px",
    size: "0.8125rem",
    tracking: "0em",
  },
  {
    label: "Button 1",
    spec: "16px · 24px",
    size: "0.8125rem",
    tracking: "0em",
  },
  {
    label: "Body 2",
    spec: "14px · 20px",
    size: "0.75rem",
    tracking: "0em",
  },
  {
    label: "Button 2",
    spec: "14px · 20px",
    size: "0.75rem",
    tracking: "0em",
  },
  {
    label: "Caption",
    spec: "12px · 18px",
    size: "0.6875rem",
    tracking: "0em",
  },
] as const;

const WEIGHTS = [200, 350, 550] as const;

const COLORS = [
  {
    name: "Silver",
    src: "/images/aeon/ia/visual-language/silver.jpg",
  },
  {
    name: "Ocean Silver",
    src: "/images/aeon/ia/visual-language/ocean-silver.jpg",
  },
  {
    name: "Sandish Silver",
    src: "/images/aeon/ia/visual-language/sandish-silver.jpg",
  },
] as const;

export function AeonVisualLanguageFigure() {
  const [activeWeight, setActiveWeight] = useState<(typeof WEIGHTS)[number]>(350);
  const [activeColor, setActiveColor] = useState(0);

  return (
    <section
      className="not-prose overflow-hidden rounded-none bg-black pb-16 text-[#f2f2f2] sm:pb-20"
      aria-label="AEON HMI visual language"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:gap-20">
        <div>
          <div className="mb-8 flex items-end justify-between gap-6">
            <p className="text-[13px] font-medium tracking-[0.04em] text-white/70">
              Typography
            </p>
            <p
              className="text-[1.75rem] font-medium leading-none tracking-[-0.02em] text-white"
              style={{ fontFamily: "Aspekta, sans-serif" }}
            >
              Aspekta
            </p>
          </div>

          <div
            className="mb-5 flex gap-2"
            role="tablist"
            aria-label="Aspekta weights"
          >
            {WEIGHTS.map((weight) => {
              const isActive = activeWeight === weight;

              return (
                <button
                  key={weight}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveWeight(weight)}
                  onMouseEnter={() => setActiveWeight(weight)}
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] tracking-[0.04em] transition-colors duration-300",
                    isActive
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70",
                  ].join(" ")}
                >
                  {weight}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col">
            {TYPE_ROWS.map((row) => (
              <div
                key={row.label}
                className="group border-t border-white/10 py-3.5 transition-colors duration-300 first:border-t-0 hover:border-white/20"
              >
                <div className="mb-2 flex items-baseline justify-between gap-4 text-[10px] text-white/35 transition-colors duration-300 group-hover:text-white/55">
                  <p>{row.label}</p>
                  <p>{row.spec}</p>
                </div>
                <div
                  className="grid grid-cols-3 gap-3"
                  style={{
                    fontFamily: "Aspekta, sans-serif",
                    fontSize: row.size,
                    lineHeight: 1.25,
                    letterSpacing: row.tracking,
                  }}
                >
                  {WEIGHTS.map((weight) => {
                    const isActive = activeWeight === weight;

                    return (
                      <button
                        key={weight}
                        type="button"
                        onMouseEnter={() => setActiveWeight(weight)}
                        onFocus={() => setActiveWeight(weight)}
                        onClick={() => setActiveWeight(weight)}
                        className={[
                          "text-left transition-opacity duration-300",
                          isActive
                            ? "opacity-100"
                            : "opacity-25 hover:opacity-70",
                        ].join(" ")}
                        style={{ fontWeight: weight }}
                      >
                        {row.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-12">
          <div>
            <p className="mb-6 text-[13px] font-medium tracking-[0.04em] text-white/70">
              Color
            </p>
            <div className="grid grid-cols-3 gap-4">
              {COLORS.map((color, index) => {
                const isActive = activeColor === index;

                return (
                  <button
                    key={color.name}
                    type="button"
                    onMouseEnter={() => setActiveColor(index)}
                    onFocus={() => setActiveColor(index)}
                    onClick={() => setActiveColor(index)}
                    className="group/color text-left"
                    aria-pressed={isActive}
                  >
                    <div
                      className={[
                        "relative aspect-[2/5] overflow-hidden bg-black transition-transform duration-500 ease-out",
                        isActive ? "scale-[1.04]" : "scale-100",
                      ].join(" ")}
                    >
                      <Image
                        src={color.src}
                        alt={`${color.name} material sample`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover/color:scale-110"
                        sizes="(min-width: 1024px) 12vw, 28vw"
                      />
                    </div>
                    <p
                      className={[
                        "mt-3 text-[12px] leading-tight transition-colors duration-300",
                        isActive ? "text-white" : "text-white/45",
                      ].join(" ")}
                    >
                      {color.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-6 text-[13px] font-medium tracking-[0.04em] text-white/70">
              Interaction
            </p>
            <div className="grid grid-cols-2 items-end gap-6">
              <figure className="group/load m-0 flex flex-col items-center">
                <div className="relative aspect-square w-full max-w-[7.5rem] overflow-hidden transition-transform duration-500 ease-out group-hover/load:scale-110">
                  <img
                    src="/images/aeon/ia/visual-language/interaction-loading.gif"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain opacity-80 transition-opacity duration-500 group-hover/load:opacity-100"
                  />
                </div>
                <figcaption
                  className="mt-3 text-center text-[11px] font-[200] text-white/55 transition-colors duration-300 group-hover/load:text-white"
                  style={{ fontFamily: "Aspekta, sans-serif" }}
                >
                  Loading / Waiting
                </figcaption>
              </figure>

              <figure className="group/talk m-0 flex flex-col items-center">
                <div className="relative flex h-16 w-full items-center overflow-hidden rounded-full transition-transform duration-500 ease-out group-hover/talk:scale-105">
                  <img
                    src="/images/aeon/ia/visual-language/interaction-conversation.gif"
                    alt=""
                    className="absolute left-[-8%] top-[-155%] h-[390%] w-[116%] max-w-none opacity-80 blur-[4px] transition-[opacity,filter] duration-500 group-hover/talk:opacity-100 group-hover/talk:blur-[2px]"
                  />
                </div>
                <figcaption
                  className="mt-3 text-center text-[11px] font-[200] text-white/55 transition-colors duration-300 group-hover/talk:text-white"
                  style={{ fontFamily: "Aspekta, sans-serif" }}
                >
                  Interaction / Conversation
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

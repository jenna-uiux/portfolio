"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type ExplorationOption = {
  number: string;
  title: string;
  pros: string[];
  cons: string[];
  image?: { filename: string; description: string; src?: string };
};

type Props = {
  intro?: string;
  options: ExplorationOption[];
  finalPickLabel?: string;
  finalPickBody?: string;
};

export function ExplorationCards({
  intro,
  options,
  finalPickLabel,
  finalPickBody,
}: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.07 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cols =
    options.length === 2
      ? "md:grid-cols-2"
      : options.length >= 3
      ? "md:grid-cols-3"
      : "md:grid-cols-1";

  const hoveredImage =
    hovered !== null ? options[hovered]?.image : undefined;
  const isLastCard = hovered === options.length - 1;

  return (
    <div ref={ref} className="exploration-cards">
      {intro ? (
        <p data-reveal className="max-w-[60ch] t-body">
          <RichText text={intro} />
        </p>
      ) : null}

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        className={[
          "relative grid grid-cols-1 gap-x-6 gap-y-6",
          cols,
          intro ? "mt-6" : "",
        ].join(" ")}
      >
        {options.map((opt, i) => {
          const isHovered = hovered === i;
          return (
            <article
              key={opt.number}
              data-reveal
              onMouseEnter={() => opt.image && setHovered(i)}
              onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
              className={[
                "group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)] transition-all duration-200",
                opt.image
                  ? "cursor-pointer hover:-translate-y-0.5 hover:ring-black/20"
                  : "",
              ].join(" ")}
            >
              {/* thumbnail strip hint */}
              {opt.image?.src ? (
                <div className="relative h-[72px] w-full shrink-0 overflow-hidden">
                  <Image
                    src={opt.image.src}
                    alt=""
                    fill
                    className={[
                      "object-cover object-top transition-all duration-300",
                      isHovered ? "opacity-100 scale-[1.02]" : "opacity-40",
                    ].join(" ")}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    aria-hidden
                  />
                  {/* "hover to preview" label */}
                  <span
                    className={[
                      "absolute bottom-2 right-2 rounded-full px-2 py-0.5 t-mono transition-opacity duration-200",
                      isHovered ? "opacity-0" : "opacity-100",
                    ].join(" ")}
                    style={{
                      background: "rgba(255,255,255,0.82)",
                      backdropFilter: "blur(4px)",
                      color: "rgba(23,23,23,0.55)",
                    }}
                  >
                    Hover to preview
                  </span>
                </div>
              ) : null}

              <div className="flex flex-1 flex-col px-6 py-5">
                <span
                  className="t-mono tabular-nums"
                  style={{ color: "var(--accent)" }}
                >
                  {opt.number}
                </span>
                <h5 className="mt-3 text-[17px] font-medium leading-[1.35] tracking-[-0.005em] text-ink">
                  <RichText text={opt.title} />
                </h5>

                <ul className="mt-5 space-y-2">
                  {opt.pros.map((p, pi) => (
                    <li
                      key={`p-${pi}`}
                      className="flex items-baseline gap-3 t-body-sm"
                    >
                      <span
                        aria-hidden
                        className="t-mono shrink-0 select-none leading-none"
                        style={{ color: "var(--accent)" }}
                      >
                        +
                      </span>
                      <span>
                        <RichText text={p} />
                      </span>
                    </li>
                  ))}
                  {opt.cons.map((c, ci) => (
                    <li
                      key={`c-${ci}`}
                      className="flex items-baseline gap-3 t-body-sm text-ink/70"
                    >
                      <span
                        aria-hidden
                        className="t-mono shrink-0 select-none leading-none text-ink/40"
                      >
                        −
                      </span>
                      <span>
                        <RichText text={c} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}

        {hoveredImage?.src ? (
          <div
            aria-hidden
            className="pointer-events-none absolute z-30 hidden md:block"
            style={{
              left: pos.x,
              top: pos.y,
              transform: isLastCard
                ? "translate(calc(-100% - 16px), calc(-100% - 12px))"
                : "translate(16px, calc(-100% - 12px))",
            }}
          >
            <div
              className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-20px_rgba(0,0,0,0.35)]"
              style={{ width: 380 }}
            >
              <Image
                src={hoveredImage.src}
                alt={hoveredImage.description}
                width={380}
                height={0}
                style={{ width: "100%", height: "auto", display: "block" }}
                sizes="380px"
              />
            </div>
          </div>
        ) : null}
      </div>

      {finalPickLabel || finalPickBody ? (
        <div
          data-reveal
          className="mt-8 flex flex-col gap-3 border-t hairline pt-6 md:flex-row md:items-baseline md:gap-10"
        >
          {finalPickLabel ? (
            <p className="t-eyebrow shrink-0 md:w-[160px]">{finalPickLabel}</p>
          ) : null}
          {finalPickBody ? (
            <p className="max-w-[48ch] t-body">
              <RichText text={finalPickBody} />
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

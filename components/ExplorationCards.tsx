"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
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
  const [selected, setSelected] = useState(0);

  const hasImages = options.some((opt) => opt.image?.src);
  const selectedOption = options[selected];

  const renderProsCons = (opt: ExplorationOption) => (
    <ul className="mt-4 space-y-1.5">
      {opt.pros.map((p, pi) => (
        <li key={`p-${pi}`} className="flex items-baseline gap-3 t-body-sm">
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
  );

  return (
    <div ref={ref} className="exploration-cards">
      {intro ? (
        <p data-reveal className="max-w-[60ch] t-body">
          <RichText text={intro} />
        </p>
      ) : null}

      {/* Desktop: preview panel on the left, selectable options on the right */}
      {hasImages ? (
        <div
          data-reveal
          className={[
            "hidden gap-6 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-stretch",
            intro ? "mt-6" : "",
          ].join(" ")}
        >
          <figure className="relative min-h-[480px] overflow-hidden rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)]">
            {options.map((opt, i) =>
              opt.image?.src ? (
                <Image
                  key={opt.number}
                  src={opt.image.src}
                  alt={opt.image.description}
                  fill
                  className={[
                    "object-contain p-4 transition-opacity duration-300",
                    selected === i ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  priority={i === 0}
                />
              ) : null
            )}
            <span
              className="absolute left-4 top-4 inline-flex items-center rounded-full px-2.5 py-0.5 t-mono"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              Option {selectedOption?.number}
            </span>
          </figure>

          <div className="flex flex-col gap-4">
            {options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <article
                  key={opt.number}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(i);
                    }
                  }}
                  className={[
                    "flex-1 cursor-pointer rounded-2xl bg-white px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)] transition-all duration-200 focus-visible:outline-none",
                    isSelected
                      ? "ring-2"
                      : "ring-1 ring-black/10 hover:-translate-y-0.5 hover:ring-black/20",
                  ].join(" ")}
                  style={
                    isSelected
                      ? ({ "--tw-ring-color": "var(--accent)" } as CSSProperties)
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="t-mono tabular-nums"
                      style={{ color: "var(--accent)" }}
                    >
                      {opt.number}
                    </span>
                    {isSelected ? (
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 t-mono"
                        style={{
                          background: "var(--accent-soft)",
                          color: "var(--accent)",
                        }}
                      >
                        Previewing
                      </span>
                    ) : null}
                  </div>
                  <h5 className="mt-2 text-[15px] font-medium leading-[1.35] tracking-[-0.005em] text-ink">
                    <RichText text={opt.title} />
                  </h5>
                  {renderProsCons(opt)}
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Mobile (or no images): stacked cards with inline screenshots */}
      <div
        className={[
          hasImages ? "grid grid-cols-1 gap-y-6 md:hidden" : "grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6",
          intro ? "mt-6" : "",
        ].join(" ")}
      >
        {options.map((opt) => (
          <article
            key={opt.number}
            data-reveal={hasImages ? undefined : true}
            className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)]"
          >
            {opt.image?.src ? (
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-black/5 bg-black/[0.02]">
                <Image
                  src={opt.image.src}
                  alt={opt.image.description}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
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
              {renderProsCons(opt)}
            </div>
          </article>
        ))}
      </div>

      {finalPickLabel || finalPickBody ? (
        <div
          data-reveal
          className="mt-8 max-w-[80%] flex flex-col gap-3 border-t hairline pt-6 md:flex-row md:items-baseline md:gap-10"
        >
          {finalPickLabel ? (() => {
            const colonIdx = finalPickLabel.indexOf(":");
            const prefix = colonIdx !== -1 ? finalPickLabel.slice(0, colonIdx + 1) : finalPickLabel;
            const suffix = colonIdx !== -1 ? finalPickLabel.slice(colonIdx + 1).trim() : null;
            return (
              <div className="shrink-0 md:w-[160px]">
                <p className="t-eyebrow">{prefix}</p>
                {suffix ? (
                  <p className="mt-1 text-[clamp(20px,1.8vw,26px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
                    {suffix}
                  </p>
                ) : null}
              </div>
            );
          })() : null}
          {finalPickBody ? (
            <p className="t-body">
              <RichText text={finalPickBody} />
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

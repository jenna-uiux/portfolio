"use client";

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

  const cols =
    options.length === 2
      ? "md:grid-cols-2"
      : options.length >= 3
      ? "md:grid-cols-3"
      : "md:grid-cols-1";

  return (
    <div ref={ref} className="exploration-cards">
      {intro ? (
        <p data-reveal className="max-w-[60ch] t-body">
          <RichText text={intro} />
        </p>
      ) : null}

      <div
        className={[
          "grid grid-cols-1 gap-x-6 gap-y-6",
          cols,
          intro ? "mt-6" : "",
        ].join(" ")}
      >
        {options.map((opt) => (
          <article
            key={opt.number}
            data-reveal
            className="flex h-full flex-col rounded-2xl bg-white px-6 py-6 ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-28px_rgba(0,0,0,0.18)]"
          >
            <span
              className="t-mono tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {opt.number}
            </span>
            <h5 className="mt-3 max-w-[24ch] text-[17px] font-medium leading-[1.35] tracking-[-0.005em] text-ink">
              <RichText text={opt.title} />
            </h5>

            <ul className="mt-5 space-y-2">
              {opt.pros.map((p, i) => (
                <li
                  key={`p-${i}`}
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
              {opt.cons.map((c, i) => (
                <li
                  key={`c-${i}`}
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
          </article>
        ))}
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

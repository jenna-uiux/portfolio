"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type Pillar = {
  number: string;
  title: string;
  body: string;
  sourceCaption?: string;
};

type Props = {
  pillars: Pillar[];
};

export function PillarGrid({ pillars }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });
  const cols = pillars.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <div
      ref={ref}
      className={`pillar-grid grid grid-cols-1 gap-x-8 gap-y-10 ${cols}`}
    >
      {pillars.map((p) => (
        <article
          key={p.number}
          data-reveal
          className="flex h-full flex-col"
        >
          <span
            className="t-mono tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {p.number}
          </span>
          <h4 className="mt-4 max-w-[22ch] t-h4">
            <RichText text={p.title} />
          </h4>
          <p className="mt-3 max-w-[36ch] t-body-sm">
            <RichText text={p.body} />
          </p>
          {p.sourceCaption ? (
            <p className="mt-4 t-caption tracking-normal normal-case">
              {p.sourceCaption}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type EvidenceInsight = {
  number: string;
  title: string;
  body: string;
  evidenceQuote?: string;
  evidenceSource?: string;
  footer?: string;
};

type Props = {
  insights: EvidenceInsight[];
};

export function EvidenceInsights({ insights }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.06 });

  return (
    <div ref={ref} className="evidence-insights">
      {insights.map((insight, i) => (
        <article
          key={insight.number}
          data-reveal
          className={[
            "grid grid-cols-1 gap-y-4 py-12 md:grid-cols-[80px_1fr] md:gap-x-12",
            i === 0 ? "border-t hairline" : "",
            "border-b hairline",
          ].join(" ")}
        >
          <div
            className="font-light italic leading-none tracking-[-0.02em] text-[44px] md:text-[56px]"
            style={{ color: "var(--accent-orange)" }}
          >
            {insight.number}
          </div>
          <div className="flex flex-col">
            <h4 className="max-w-[28ch] t-h3">
              <RichText text={insight.title} />
            </h4>
            <p className="mt-5 max-w-[60ch] t-body">
              <RichText text={insight.body} />
            </p>
            {insight.evidenceQuote ? (
              <figure className="mt-6 max-w-[60ch] rounded-2xl border border-ink/10 bg-white px-6 py-5">
                <blockquote className="font-light italic leading-[1.55] text-[15px] text-ink/75 md:text-[16px]">
                  <RichText text={insight.evidenceQuote} />
                </blockquote>
                {insight.evidenceSource ? (
                  <figcaption className="mt-3 t-mono">
                    {insight.evidenceSource}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
            {insight.footer ? (
              <p className="mt-6 max-w-[60ch] t-body">
                <RichText text={insight.footer} />
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

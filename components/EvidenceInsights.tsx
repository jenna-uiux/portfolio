"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type EvidenceInsight = {
  number: string;
  title: string;
  body: string;
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
            "grid grid-cols-1 gap-y-3 py-9 md:grid-cols-[64px_1fr] md:gap-x-10",
            i === 0 ? "border-t hairline" : "",
            "border-b hairline",
          ].join(" ")}
        >
          <div
            className="font-light italic leading-none tracking-[-0.02em] text-[34px] md:text-[44px]"
            style={{ color: "var(--accent-orange)" }}
          >
            {insight.number}
          </div>
          <div className="flex flex-col">
            <h4 className="max-w-[32ch] t-h4">
              <RichText text={insight.title} />
            </h4>
            <p className="mt-3 max-w-[62ch] t-body">
              <RichText text={insight.body} />
            </p>
            {insight.footer ? (
              <p className="mt-4 max-w-[58ch] text-[15px] font-normal leading-[1.55] text-ink/90">
                <RichText text={insight.footer} />
              </p>
            ) : null}
            {insight.evidenceSource ? (
              <p className="mt-4 t-mono">{insight.evidenceSource}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

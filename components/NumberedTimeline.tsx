"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type TimelineStep = { num: string; name: string; note?: string };

type Props = {
  steps: TimelineStep[];
};

export function NumberedTimeline({ steps }: Props) {
  const ref = useScrollReveal<HTMLOListElement>({
    stagger: 0.12,
    yOffset: 12,
    duration: 0.5,
    start: "top 80%",
  });

  return (
    <ol
      ref={ref}
      className="numbered-timeline w-full max-w-none divide-y hairline border-y hairline"
    >
      {steps.map((step) => (
        <li
          key={step.num}
          data-reveal
          className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 py-5 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-x-10"
        >
          <span
            className="t-mono shrink-0 tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {step.num}
          </span>
          <p className="t-h4 whitespace-pre-line font-normal text-ink">
            {step.name}
          </p>
          {step.note ? (
            <p className="col-start-2 max-w-[48ch] t-body-sm md:col-start-3">
              <RichText text={step.note} />
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

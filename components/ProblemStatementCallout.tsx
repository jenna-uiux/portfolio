"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

type Props = {
  body: string;
};

export function ProblemStatementCallout({ body }: Props) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <figure
      ref={ref}
      className="problem-statement border-y hairline py-10 md:py-14"
    >
      <p data-reveal className="t-eyebrow">
        Problem statement
      </p>
      <blockquote
        data-reveal
        className="mt-5 max-w-[34ch] text-ink"
        style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400,
          fontSize: "clamp(28px, 3.4vw, 36px)",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        <RichText text={body} />
      </blockquote>
    </figure>
  );
}

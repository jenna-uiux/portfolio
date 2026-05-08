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
        className="mt-5 max-w-[34ch] font-light leading-[1.1] tracking-[-0.04em] text-ink text-[clamp(1.6rem,3.6vw,2.8rem)]"
      >
        <RichText text={body} />
      </blockquote>
    </figure>
  );
}

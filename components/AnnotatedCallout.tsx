"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

type Props = {
  label: string;
  body: string;
  tone?: "neutral" | "accent";
};

export function AnnotatedCallout({ label, body, tone = "accent" }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.04 });

  const labelClass = tone === "accent" ? "t-eyebrow" : "t-eyebrow-mut";

  return (
    <aside
      ref={ref}
      className="annotated-callout flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10"
    >
      <p
        data-reveal
        className={`${labelClass} shrink-0 md:w-[160px] md:pt-[0.4em]`}
      >
        {label}
      </p>
      <p
        data-reveal
        className="max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.25rem)] font-light leading-[1.45] tracking-[-0.005em] text-ink"
      >
        <RichText text={body} />
      </p>
    </aside>
  );
}

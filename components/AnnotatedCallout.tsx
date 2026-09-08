"use client";

import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

type Props = {
  label: string;
  body: string;
  tone?: "neutral" | "accent";
  variant?: "default" | "panel";
};

export function AnnotatedCallout({
  label,
  body,
  tone = "accent",
  variant = "default",
}: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.04 });

  const labelClass = tone === "accent" ? "t-eyebrow" : "t-eyebrow-mut";

  if (variant === "panel") {
    return (
      <aside
        ref={ref}
        className="not-prose rounded-sm border border-white/[0.06] bg-white/[0.035] px-6 py-8 md:px-10 md:py-10"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-12 lg:gap-16">
          <p
            data-reveal
            className="shrink-0 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white/45 md:w-[9.5rem] md:pt-1"
          >
            {label}
          </p>
          <p
            data-reveal
            className="max-w-[48ch] text-[clamp(17px,1.9vw,22px)] font-light leading-[1.45] tracking-[-0.01em] text-white/95"
          >
            <RichText text={body} />
          </p>
        </div>
      </aside>
    );
  }

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

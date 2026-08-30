import { Battery, CirclePlay } from "lucide-react";

export type AffinityInsight = {
  number: string;
  title: string;
  body: string;
  tone?: "accent" | "ink";
};

type Props = {
  insights: AffinityInsight[];
};

export function AffinityInsightCards({ insights }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
      {insights.map((insight, index) => (
        <article
          key={insight.number}
          className="flex min-h-[270px] flex-col rounded-xl border border-ink/[0.06] bg-white p-6 md:p-8"
        >
          <div className="text-[color:var(--accent-orange)]">
            {index === 0 ? (
              <Battery aria-hidden="true" size={40} strokeWidth={1.6} />
            ) : (
              <CirclePlay aria-hidden="true" size={40} strokeWidth={1.6} />
            )}
          </div>
          <p className="mt-7 t-eyebrow">Insight {insight.number}</p>
            <h4 className="mt-3 max-w-[26ch] text-[18px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
              {insight.title}
            </h4>
            <p className="mt-3 max-w-[46ch] text-[15px] font-light leading-[1.65] text-ink/65">
              {insight.body}
            </p>
          </article>
      ))}
    </div>
  );
}

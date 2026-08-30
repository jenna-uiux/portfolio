import { ArrowDown } from "lucide-react";

type Props = {
  insights: string[];
  goal: string;
  principles: string[];
};

export function InsightDirectionMap({
  insights,
  goal,
  principles,
}: Props) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40">
        Research insights
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {insights.map((insight, index) => (
          <div
            key={insight}
            className="rounded-xl border border-ink/[0.08] bg-white px-5 py-4 md:px-6 md:py-5"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/45">
              Insight {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 max-w-[32ch] text-[17px] font-medium leading-[1.45] tracking-[-0.01em] text-ink">
              {insight}
            </p>
          </div>
        ))}
      </div>

      <Connector />

      <div className="border-y border-[color:var(--accent-orange)]/30 bg-[color:var(--accent-orange)]/[0.08] px-6 py-7 text-center md:px-10 md:py-9">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
          Design goal
        </p>
        <p className="mx-auto mt-3 max-w-[56ch] text-[clamp(20px,2.2vw,26px)] font-medium leading-[1.35] tracking-[-0.015em] text-ink">
          {goal}
        </p>
      </div>

      <Connector />

      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40">
        Design principles
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {principles.map((principle, index) => (
          <div
            key={principle}
            className="min-h-[126px] rounded-xl border border-ink/[0.07] bg-white p-5 md:p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
              Principle {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-3 max-w-[32ch] text-[17px] font-medium leading-[1.45] tracking-[-0.01em] text-ink">
              {principle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-16 flex-col items-center justify-center">
      <span className="h-6 w-px bg-ink/15" />
      <ArrowDown
        aria-hidden="true"
        size={16}
        strokeWidth={1.5}
        className="text-ink/30"
      />
    </div>
  );
}

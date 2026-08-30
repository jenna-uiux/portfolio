import {
  Activity,
  ArrowRight,
  ListTree,
  Mic,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const logicSteps = [
  {
    number: "01",
    title: "Structure",
    body: "Turn the goal into tasks and smaller steps.",
    icon: ListTree,
  },
  {
    number: "02",
    title: "Estimate",
    body: "Estimate current capacity from Apple Health signals.",
    icon: Activity,
  },
  {
    number: "03",
    title: "Match",
    body: "Select or break down the next realistic step.",
    icon: Sparkles,
  },
];

export function ProductLogicFlow() {
  return (
    <figure
      aria-label="Fini product logic from user inputs through system processing to a user-reviewed next step"
      className="rounded-2xl bg-ink/[0.025]"
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_34px_2.3fr_34px_0.9fr] lg:items-stretch lg:gap-0">
        <FlowGroup label="User input + context">
          <div className="grid h-full gap-3">
            <InputCard
              icon={Mic}
              label="User input"
              title="Spoken goal"
              body="“Finish my case study this week.”"
            />
            <InputCard
              icon={Activity}
              label="Context input"
              title="Apple Health data"
              body="Sleep · HRV · Activity"
            />
          </div>
        </FlowGroup>

        <FlowArrow />

        <FlowGroup label="Fini system logic" accent>
          <div className="grid h-full overflow-hidden rounded-xl border border-[color:var(--accent-orange)]/20 bg-[color:var(--accent-orange)]/[0.07] md:grid-cols-3">
            {logicSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className={[
                    "flex min-h-[230px] flex-col p-5 md:p-6",
                    index > 0
                      ? "border-t border-[color:var(--accent-orange)]/15 md:border-l md:border-t-0"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium tabular-nums text-ink/45">
                      {step.number}
                    </span>
                    <Icon
                      aria-hidden="true"
                      size={19}
                      strokeWidth={1.6}
                      className="text-[color:var(--accent-orange)]"
                    />
                  </div>
                  <h4 className="mt-6 text-[20px] font-medium leading-[1.25] tracking-[-0.015em] text-ink">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-[14px] font-light leading-[1.55] text-ink/60">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </FlowGroup>

        <FlowArrow />

        <FlowGroup label="User review">
          <div className="flex h-full min-h-[230px] flex-col rounded-xl border border-ink/[0.08] bg-white p-5 md:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45">
                Recommended output
              </p>
              <SlidersHorizontal
                aria-hidden="true"
                size={19}
                strokeWidth={1.6}
                className="text-[color:var(--accent-orange)]"
              />
            </div>
            <h4 className="mt-6 text-[20px] font-medium leading-[1.25] tracking-[-0.015em] text-ink">
              One next step
            </h4>
            <p className="mt-3 text-[14px] font-light leading-[1.55] text-ink/60">
              Fini shows the selected step and the reasoning behind it.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-7">
              {["Review", "Edit", "Override"].map((action) => (
                <span
                  key={action}
                  className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] font-normal text-ink/55"
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        </FlowGroup>
      </div>
    </figure>
  );
}

function FlowGroup({
  label,
  accent = false,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <p
        className={[
          "mb-3 text-[10px] font-medium uppercase tracking-[0.14em]",
          accent ? "text-[color:var(--accent-orange)]" : "text-ink/40",
        ].join(" ")}
      >
        {label}
      </p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center justify-center pt-1 lg:pt-7">
      <ArrowRight
        aria-hidden="true"
        size={20}
        strokeWidth={1.4}
        className="rotate-90 text-ink/25 lg:rotate-0"
      />
    </div>
  );
}

function InputCard({
  icon: Icon,
  label,
  title,
  body,
}: {
  icon: typeof Mic;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45">
          {label}
        </p>
        <Icon
          aria-hidden="true"
          size={18}
          strokeWidth={1.6}
          className="text-[color:var(--accent-orange)]"
        />
      </div>
      <h4 className="mt-4 text-[18px] font-medium leading-[1.25] tracking-[-0.015em] text-ink">
        {title}
      </h4>
      <p className="mt-2 text-[12px] font-light leading-[1.5] text-ink/55">
        {body}
      </p>
    </div>
  );
}

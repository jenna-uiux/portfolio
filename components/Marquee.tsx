type Props = {
  items: string[];
  duration?: number;
  className?: string;
};

export function Marquee({ items, duration = 38, className = "" }: Props) {
  const stream = items.join("   ·   ");

  return (
    <div
      aria-hidden
      className={[
        "relative w-full overflow-hidden py-2",
        className,
      ].join(" ")}
    >
      <div
        className="flex w-max gap-12 whitespace-nowrap font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink/55 marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        <span>{stream}</span>
        <span>{stream}</span>
        <span>{stream}</span>
      </div>
    </div>
  );
}

type Ratio = "16/9" | "21/9" | "4/3" | "4/5" | "1/1" | "3/2";

const ratioClass: Record<Ratio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

const ratioLabel: Record<Ratio, string> = {
  "16/9": "16:9",
  "21/9": "21:9",
  "4/3": "4:3",
  "4/5": "4:5",
  "1/1": "1:1",
  "3/2": "3:2",
};

type Props = {
  filename: string;
  description: string;
  ratio?: Ratio;
  compact?: boolean;
  className?: string;
};

export function ImageSlot({
  filename,
  description,
  ratio = "16/9",
  compact = false,
  className = "",
}: Props) {
  return (
    <div
      role="img"
      aria-label={`${description} (${filename})`}
      className={[
        "relative w-full overflow-hidden border border-dashed border-ink/15 bg-ink/[0.04]",
        compact ? "rounded-md" : "rounded-lg",
        ratioClass[ratio],
        className,
      ].join(" ")}
    >
      <div aria-hidden className="absolute inset-0 grain opacity-30" />

      <span className="absolute left-3 top-3 t-mono">Image</span>

      <span className="absolute right-3 top-3 t-mono">
        {ratioLabel[ratio]}
      </span>

      <div
        className={[
          "absolute inset-0 flex flex-col items-center justify-center text-center",
          compact ? "px-4" : "px-8",
        ].join(" ")}
      >
        <p className="t-caption">{description}</p>
        <p className="mt-1 t-mono">{filename}</p>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink/10"
      />
    </div>
  );
}

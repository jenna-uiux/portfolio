type Props = {
  kicker?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "start",
}: Props) {
  return (
    <header
      className={
        align === "center"
          ? "text-center max-w-2xl mx-auto"
          : "max-w-2xl"
      }
    >
      {kicker ? <p className="text-mono-kicker">{kicker}</p> : null}
      <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[58ch] text-[15px] font-light leading-[1.65] text-ink/75">
          {description}
        </p>
      ) : null}
    </header>
  );
}

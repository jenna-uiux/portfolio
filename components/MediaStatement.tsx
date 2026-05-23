import Image from "next/image";

export type MediaStatementProps = {
  src: string;
  alt?: string;
  /** Small label in the top-left (e.g. "BACKGROUND", "TARGET REGION") */
  eyebrow?: string;
  /** Large statement text in the middle (centered) */
  headline?: string;
  /** Optional bottom-left body copy */
  body?: string;
  /** Source citation in the bottom-right */
  source?: string;
  /** Vertical aspect — defaults to 21:9 for cinematic slides */
  ratio?: "21/9" | "16/9" | "4/3" | "3/2";
  /** Overall darkening overlay (0-1). Defaults to 0.55. */
  overlay?: number;
  /** Where the headline sits within the frame */
  align?: "center" | "left-bottom";
  /** Default: large hero type; compact: smaller for research / dense slides */
  headlineSize?: "default" | "compact";
};

const HEADLINE_FONT: Record<
  NonNullable<MediaStatementProps["headlineSize"]> | "default",
  string
> = {
  default: "36px",
  compact: "clamp(18px, 2.35vw, 26px)",
};

const ratioClass: Record<NonNullable<MediaStatementProps["ratio"]>, string> = {
  "21/9": "aspect-[21/9]",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
};

export function MediaStatement({
  src,
  alt = "",
  eyebrow,
  headline,
  body,
  source,
  ratio = "21/9",
  overlay = 0.55,
  align = "center",
  headlineSize = "default",
}: MediaStatementProps) {
  const headlineFont = HEADLINE_FONT[headlineSize];
  return (
    <div className="not-prose">
      <div className={`relative w-full overflow-hidden rounded-sm ${ratioClass[ratio]}`}>
        {/* Background image */}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 80vw, 100vw"
        />

        {/* Darkening overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `rgba(0,0,0,${overlay})` }}
        />

        {/* Eyebrow — top-left */}
        {eyebrow ? (
          <div className="absolute left-6 top-6 md:left-10 md:top-10">
            <p
              className="text-[10px] font-medium tracking-[0.22em] uppercase md:text-[12px]"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {eyebrow}
            </p>
          </div>
        ) : null}

        {/* Headline — centered or bottom-left */}
        {headline ? (
          <div
            className={
              align === "center"
                ? "absolute inset-0 flex items-center justify-center px-8"
                : "absolute bottom-6 left-6 md:bottom-12 md:left-10"
            }
          >
            <p
              className={[
                headlineSize === "compact" ? "max-w-[36ch]" : "max-w-[24ch]",
                align === "center" ? "text-center" : "",
              ].join(" ")}
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: headlineFont,
                fontWeight: 350,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                textShadow: "0 0 18px rgba(0,0,0,0.55)",
              }}
            >
              {renderHeadline(headline)}
            </p>
          </div>
        ) : null}

        {/* Body — bottom-left (when align=center, headline takes center) */}
        {body && align === "center" ? (
          <div className="absolute bottom-6 left-6 max-w-[42ch] md:bottom-10 md:left-10">
            <p
              className={[
                "leading-relaxed",
                headlineSize === "compact"
                  ? "text-[12px] md:text-[13px]"
                  : "text-[14px] md:text-[16px]",
              ].join(" ")}
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {body}
            </p>
          </div>
        ) : null}

        {/* Source — bottom-right */}
        {source ? (
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8">
            <p
              className="text-[10px] tracking-wide"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {source}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Parse headline: words wrapped in **bold** render brighter, the rest stays slightly dimmed.
 *  Supports a `\n` for explicit line breaks. */
function renderHeadline(text: string) {
  return text.split("\n").map((line, lineIdx) => (
    <span
      key={lineIdx}
      style={{
        display: "block",
        marginTop: lineIdx === 0 ? 0 : "0.1em",
        lineHeight: 1.18,
      }}
    >
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} style={{ color: "rgba(255,255,255,1)" }}>
              {part.slice(2, -2)}
            </span>
          );
        }
        return (
          <span key={i} style={{ color: "rgba(205,205,205,0.95)" }}>
            {part}
          </span>
        );
      })}
    </span>
  ));
}

"use client";

import Image from "next/image";

/** Minimal **bold** split for case copy (avoids importing RichText circularly). */
function BoldParts({
  text,
  strongClassName,
  muted,
}: {
  text: string;
  strongClassName?: string;
  muted?: boolean;
}) {
  const base = muted ? "text-[rgba(210,210,210,0.92)]" : "text-ink";
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={strongClassName ?? "font-medium text-ink"}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return (
          <span key={i} className={base}>
            {part}
          </span>
        );
      })}
    </>
  );
}

export type AeonTargetSpreadProps = {
  row1: {
    label: string;
    headline: string;
    supporting: string;
    mapSrc: string;
    mapAlt: string;
  };
  row2: {
    mapSrc: string;
    mapAlt: string;
    headline: string;
    source?: string;
  };
  row3: {
    statement: string;
  };
};

export function AeonTargetSpread({ row1, row2, row3 }: AeonTargetSpreadProps) {
  return (
    <div className="not-prose">
      {/* Row 1 — copy (narrow) + Indonesia map (wide); text baseline aligns with map bottom on md */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12 md:items-stretch md:gap-8">
        <div className="flex min-h-0 flex-col justify-start md:col-span-4 md:justify-end">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.18em] md:text-[12px]"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {row1.label}
          </p>
          <p className="mt-3 text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
            <BoldParts text={row1.headline} />
          </p>
          <p className="mt-4 max-w-[36ch] text-[14px] font-light leading-relaxed text-[rgba(210,210,210,0.9)] md:text-[15px]">
            <BoldParts
              text={row1.supporting}
              muted
              strongClassName="font-medium text-[rgba(245,245,245,0.98)]"
            />
          </p>
        </div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-white/[0.08] md:col-span-8">
          <Image
            src={row1.mapSrc}
            alt={row1.mapAlt}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>
      </div>

      {/* Row 2 — Jakarta flood map (tighter gap below Row 1) */}
      <div className="mt-4 md:mt-6">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm border border-white/[0.08]">
          <Image
            src={row2.mapSrc}
            alt={row2.mapAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.12) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col px-6 pb-4 md:px-10 md:pb-5">
            <div className="min-h-[52%] flex-1" aria-hidden />
            <div>
              <p
                className="max-w-[40ch] text-[clamp(17px,2.2vw,26px)] font-medium leading-[1.2] tracking-[-0.02em]"
                style={{
                  color: "rgba(251,251,251,0.98)",
                  textShadow: "0 2px 28px rgba(0,0,0,0.55)",
                }}
              >
                <BoldParts
                  text={row2.headline}
                  strongClassName="font-semibold text-white"
                />
              </p>
              {row2.source ? (
                <p
                  className="mt-1 max-w-[48ch] text-[10px] tracking-wide md:mt-1.5 md:text-[11px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {row2.source}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — left-rail statement */}
      <div className="mt-10 border-t border-white/[0.06] pt-10 md:mt-14 md:pt-14">
        <div className="flex items-stretch gap-4 md:gap-6">
          <div
            aria-hidden
            className="mt-0.5 w-[2px] shrink-0 rounded-full md:w-[3px]"
            style={{ background: "var(--accent)" }}
          />
          <p className="min-w-0 max-w-[62ch] text-left text-[clamp(17px,2.05vw,23px)] font-light leading-[1.5] tracking-[-0.018em] text-ink">
            <BoldParts
              text={row3.statement}
              strongClassName="font-medium text-ink"
            />
          </p>
        </div>
      </div>
    </div>
  );
}

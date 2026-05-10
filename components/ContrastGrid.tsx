"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RichText } from "./CaseStudyBlocks";
import { useScrollReveal } from "@/lib/useScrollReveal";

export type ContrastItem = {
  label: string;
  title: string;
  body?: string;
  examples?: string[];
  verdict?: string;
  verdictTone?: "done" | "fail";
};

type Props = {
  items: ContrastItem[];
};

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 9L7 13L14.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 5L13 13M13 5L5 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ContrastGrid({ items }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({
    stagger: 0.05,
    yOffset: 10,
    duration: 0.45,
  });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="border-y hairline">
      <div className="grid md:grid-cols-2">
        {items.map((item, i) => {
          const positiveColumn = item.verdictTone === "done";
          const verdictColor =
            item.verdictTone === "done"
              ? "#3f7a52"
              : item.verdictTone === "fail"
                ? "#dc2626"
                : "var(--ink)";
          const iconColor = positiveColumn ? "#3f7a52" : "#dc2626";

          return (
            <div
              key={i}
              className={[
                "flex flex-col py-10",
                i === 0
                  ? "md:pr-10"
                  : "border-t hairline pt-10 md:border-t-0 md:border-l md:hairline md:pl-10 md:pt-10",
              ].join(" ")}
            >
              <div data-reveal>
                <p className="t-eyebrow-mut">{item.label}</p>
              </div>
              <h4 data-reveal className="mt-4 max-w-[24ch] t-h4">
                <RichText text={item.title} />
              </h4>
              {item.body ? (
                <p data-reveal className="mt-3 max-w-[36ch] t-body-sm">
                  <RichText text={item.body} />
                </p>
              ) : null}
              {item.examples && item.examples.length > 0 ? (
                <ul className="mt-6 divide-y hairline border-y hairline">
                  {item.examples.map((ex, j) => (
                    <li
                      key={j}
                      data-reveal
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="min-w-0 flex-1 t-body-sm text-ink/80">
                        <RichText text={ex} />
                      </span>
                      <motion.span
                        className="shrink-0"
                        style={{ color: iconColor }}
                        initial={
                          reducedMotion
                            ? false
                            : { scale: 0.45, opacity: 0, rotate: positiveColumn ? -12 : 12 }
                        }
                        whileInView={
                          reducedMotion
                            ? undefined
                            : { scale: 1, opacity: 1, rotate: 0 }
                        }
                        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 22,
                          delay: reducedMotion ? 0 : j * 0.06,
                        }}
                        aria-hidden
                      >
                        {positiveColumn ? (
                          <CheckGlyph className="block" />
                        ) : (
                          <XGlyph className="block" />
                        )}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.verdict ? (
                <p
                  data-reveal
                  className="mt-5 t-mono"
                  style={{ color: verdictColor }}
                >
                  → {item.verdict}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

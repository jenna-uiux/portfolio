"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Token = {
  id: string;
  ko: string;
  label: string;
  value: string;
};

const TOKENS: Token[] = [
  { id: "city", ko: "서울특별시", label: "City", value: "Seoul" },
  { id: "state", ko: "강남구", label: "State", value: "Gangnam-gu" },
  { id: "street", ko: "테헤란로", label: "Street Name", value: "Teheran-ro" },
  { id: "number", ko: "123", label: "Street Number", value: "123" },
  { id: "apt", ko: "101동 202호", label: "Apt / Unit", value: "Dong 101, Ho 202" },
];

const tokenStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(transparent 62%, var(--accent-soft) 62%)",
  backgroundSize: "var(--hl, 0%) 100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "0 0",
  padding: "0 4px",
  margin: "0 -4px",
  borderRadius: "1px",
  transition: "color 200ms ease",
};

export function FieldTranslatorDemo() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const setInitial = () => {
        gsap.set("[data-ko]", { "--hl": "0%", color: "var(--muted)" });
        gsap.set("[data-row]", { autoAlpha: 0.35 });
        gsap.set("[data-value]", { autoAlpha: 0, x: -8 });
      };

      const setFinal = () => {
        gsap.set("[data-ko]", { "--hl": "100%", color: "var(--text)" });
        gsap.set("[data-row]", { autoAlpha: 1 });
        gsap.set("[data-value]", { autoAlpha: 1, x: 0 });
      };

      if (prefersReduced) {
        setFinal();
        return;
      }

      setInitial();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play pause resume pause",
        },
        repeat: -1,
        repeatDelay: 1.6,
        defaults: { ease: "power2.out" },
      });

      tl.from("[data-ko-line]", { autoAlpha: 0, y: 6, duration: 0.5 }, 0);

      TOKENS.forEach((t, i) => {
        const at = i === 0 ? 0.55 : "+=0.18";
        tl.to(
          `[data-ko="${t.id}"]`,
          { "--hl": "100%", color: "var(--text)", duration: 0.45 },
          at
        )
          .to(
            `[data-row="${t.id}"]`,
            { autoAlpha: 1, duration: 0.3 },
            "<"
          )
          .to(
            `[data-value="${t.id}"]`,
            { autoAlpha: 1, x: 0, duration: 0.45 },
            "<0.08"
          );
      });

      tl.to({}, { duration: 1.4 })
        .to("[data-ko]", {
          "--hl": "0%",
          color: "var(--muted)",
          duration: 0.5,
          stagger: 0.04,
        })
        .to("[data-value]", { autoAlpha: 0, x: -8, duration: 0.35 }, "<")
        .to("[data-row]", { autoAlpha: 0.35, duration: 0.35 }, "<");
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="grid gap-x-12 gap-y-10 border-t hairline pt-8 md:grid-cols-2"
    >
      <div>
        <p className="t-eyebrow-mut">User input</p>
        <div
          data-ko-line
          className="mt-5 max-w-[18ch] text-[clamp(1.5rem,2.4vw,2rem)] font-light leading-[1.5] tracking-[-0.01em]"
          aria-label="서울특별시 강남구 테헤란로 123 101동 202호"
        >
          {TOKENS.map((t, i) => (
            <span key={t.id}>
              <span
                data-ko={t.id}
                style={tokenStyle}
                className="inline-block"
              >
                {t.ko}
              </span>
              {i < TOKENS.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
        <p className="mt-6 max-w-[36ch] t-caption">
          Free-form Korean address as the applicant naturally writes it.
        </p>
      </div>

      <div>
        <p className="t-eyebrow-mut">USCIS form output</p>
        <ul className="mt-5 w-full divide-y hairline border-y hairline">
          {TOKENS.map((t) => (
            <li
              key={t.id}
              data-row={t.id}
              className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-3.5"
            >
              <span className="t-eyebrow-mut">{t.label}</span>
              <span
                data-value={t.id}
                className="text-right text-[15px] font-medium text-ink tabular-nums"
              >
                {t.value}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[36ch] t-caption">
          Parsed and reformatted into the exact fields each USCIS form expects.
        </p>
      </div>
    </div>
  );
}

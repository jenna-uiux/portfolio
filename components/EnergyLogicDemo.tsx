"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const INPUTS = [
  {
    id: "sleep",
    label: "Sleep Quality",
    value: "0.82",
    unit: "score",
    detail: "Sleep depth · consistency",
  },
  {
    id: "hrv",
    label: "HRV",
    value: "72",
    unit: "ms",
    detail: "Heart rate variability",
  },
  {
    id: "activity",
    label: "Activity Level",
    value: "6.5k",
    unit: "steps",
    detail: "Steps · exertion",
  },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function CircularProgress({
  value,
  size = 96,
  stroke = 8,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - clamp(value, 0, 100) / 100);

  useGSAP(
    () => {
      const el = circleRef.current;
      if (!el) return;
      gsap.to(el, {
        strokeDashoffset: dash,
        duration: 1.05,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    { dependencies: [dash, size, stroke] }
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(23,23,23,0.10)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--accent-orange)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function GlassPanel({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/30 bg-white/40 backdrop-blur-md",
        "shadow-[0_18px_60px_rgba(23,23,23,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

type InputCardProps = {
  label: string;
  value: string;
  unit: string;
  detail: string;
  active: boolean;
};

function InputCard({ label, value, unit, detail, active }: InputCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      if (active) {
        gsap.to(el, {
          boxShadow:
            "0 0 0 10px rgba(253, 140, 55, 0.12), 0 12px 40px rgba(253, 140, 55, 0.08)",
          repeat: -1,
          yoyo: true,
          duration: 0.75,
          ease: "sine.inOut",
        });
      } else {
        gsap.to(el, {
          boxShadow: "0 0 0 rgba(253,140,55,0)",
          duration: 0.35,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [active], scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="rounded-2xl will-change-transform">
      <GlassPanel className="px-4 py-3.5">
        <div className="t-mono">{label}</div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="t-h4">{value}</span>
          <span className="t-caption">{unit}</span>
        </div>
        <div className="mt-1 t-caption">{detail}</div>
      </GlassPanel>
    </div>
  );
}

function FunctionNode({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ring = ringRef.current;
      const root = rootRef.current;
      if (!ring || !root) return;
      gsap.killTweensOf([ring, root]);
      if (active) {
        gsap.to(ring, {
          rotation: 360,
          repeat: -1,
          duration: 7,
          ease: "none",
        });
        gsap.to(root, {
          scale: 1.04,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "sine.inOut",
        });
      } else {
        gsap.set(ring, { rotation: 0 });
        gsap.to(root, { scale: 1, duration: 0.35, ease: "power2.out" });
      }
    },
    { dependencies: [active], scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative grid h-[88px] w-[88px] place-items-center rounded-full border border-white/40 bg-white/55 backdrop-blur-md will-change-transform"
      style={{ transformOrigin: "center center" }}
    >
      <div className="t-body font-medium text-ink/85">f(x)</div>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute inset-[-6px] rounded-full border border-dashed border-[color:var(--accent-orange)]/35"
        style={{ transformOrigin: "center center" }}
      />
    </div>
  );
}

/** Horizontal dot traveling on a wire — GSAP repeat */
function WirePulse({
  delay,
  active,
  reverse = false,
}: {
  delay: number;
  active: boolean;
  reverse?: boolean;
}) {
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const dot = dotRef.current;
      if (!dot) return;
      gsap.killTweensOf(dot);
      if (!active) {
        gsap.set(dot, { opacity: 0, left: reverse ? "100%" : "0%" });
        return;
      }
      const end = reverse ? "0%" : "100%";
      const start = reverse ? "100%" : "0%";
      gsap.set(dot, { left: start, opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay });
      tl.to(dot, { opacity: 1, duration: 0.1, ease: "power1.out" })
        .to(dot, { left: end, duration: 0.78, ease: "power2.inOut" }, "<0.02")
        .to(dot, { opacity: 0, duration: 0.1, ease: "power1.in" }, ">-0.05");
    },
    { dependencies: [active, delay, reverse] }
  );

  return (
    <span
      ref={dotRef}
      aria-hidden
      className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[color:var(--accent-orange)]"
      style={{ left: reverse ? "100%" : "0%", opacity: 0 }}
    />
  );
}

type Phase = "idle" | "flowing" | "computing" | "result";

export function EnergyLogicDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const introDone = useRef(false);
  const inView = useInView(rootRef, { amount: 0.4, margin: "-10% 0px" });
  const [phase, setPhase] = useState<Phase>("idle");

  const scoreTarget = 85;
  const [scoreText, setScoreText] = useState(0);

  const scoreProxy = useRef({ v: 0 });

  /* Intro: stagger cards + kicker */
  useGSAP(
    () => {
      if (!inView || introDone.current) return;
      introDone.current = true;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set([".energy-logic-card", ".energy-logic-kicker"], {
          clearProps: "all",
        });
        return;
      }
      gsap.set(".energy-logic-card", { opacity: 0, x: -32 });
      gsap.set(".energy-logic-kicker", { opacity: 0, y: -8 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".energy-logic-kicker", { opacity: 1, y: 0, duration: 0.5 }, 0).to(
        ".energy-logic-card",
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.12 },
        0.08
      );
    },
    { scope: rootRef, dependencies: [inView] }
  );

  /* Phase loop */
  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const timers: number[] = [];

    function runCycle() {
      if (cancelled) return;
      setPhase("idle");
      scoreProxy.current.v = 0;
      setScoreText(0);

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("flowing");
        }, 380)
      );
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("computing");
        }, 1350)
      );
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          gsap.killTweensOf(scoreProxy.current);
          scoreProxy.current.v = 0;
          gsap.to(scoreProxy.current, {
            v: scoreTarget,
            duration: 1.15,
            ease: "power2.out",
            onUpdate: () => {
              setScoreText(Math.round(scoreProxy.current.v));
            },
          });
        }, 1380)
      );
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setPhase("result");
        }, 2550)
      );
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) runCycle();
        }, 4200)
      );
    }

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      const sp = scoreProxy.current;
      gsap.killTweensOf(sp);
    };
  }, [inView]);

  const isFlowing = phase === "flowing" || phase === "computing";
  const isComputing = phase === "computing";
  const showResult = phase === "result";

  /* Output panel entrance when swapping work ↔ result */
  useGSAP(
    () => {
      const panel = outputRef.current;
      if (!panel) return;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(panel, { clearProps: "all" });
        return;
      }
      gsap.fromTo(
        panel,
        { opacity: 0, y: 14, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
    },
    { scope: rootRef, dependencies: [showResult], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative w-full rounded-3xl bg-white/30 p-6 sm:p-8">
        <div aria-hidden className="absolute inset-0 grain rounded-3xl opacity-15" />

        <div className="relative mb-4 flex items-center">
          <div className="energy-logic-kicker t-mono">
            Inputs → f(x) → Energy Level
          </div>
        </div>

        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <div className="relative space-y-3">
            {INPUTS.map((input) => (
              <div key={input.id} className="energy-logic-card">
                <InputCard
                  label={input.label}
                  value={input.value}
                  unit={input.unit}
                  detail={input.detail}
                  active={isFlowing}
                />
              </div>
            ))}

            <div className="pointer-events-none absolute inset-y-0 -right-14 hidden w-14 lg:block">
              {INPUTS.map((input, i) => {
                const angle =
                  i === 0 ? 14 : i === INPUTS.length - 1 ? -14 : 0;
                return (
                  <div
                    key={`wire-${input.id}`}
                    className="absolute left-0 h-px w-full origin-left bg-ink/15"
                    style={{
                      top: `calc(${(i + 0.5) * (100 / INPUTS.length)}% )`,
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <WirePulse delay={0.12 * i} active={isFlowing} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <FunctionNode active={isFlowing || isComputing} />
          </div>

          <div className="relative min-h-[140px]">
            <div className="pointer-events-none absolute inset-y-0 -left-8 hidden w-8 lg:block">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink/15">
                <WirePulse
                  delay={0.2}
                  active={isComputing || showResult}
                  reverse={false}
                />
              </div>
            </div>

            <div ref={outputRef} key={showResult ? "result" : "work"}>
              {showResult ? (
                <GlassPanel className="px-5 py-5">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <div className="t-eyebrow-mut">Energy Level</div>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="t-h2">{scoreTarget}</span>
                        <span className="t-caption">/ 100</span>
                      </div>
                      <div className="mt-2 t-caption">
                        Computed from sleep, HRV, and activity.
                      </div>
                    </div>
                    <div className="shrink-0">
                      <CircularProgress value={scoreTarget} />
                    </div>
                  </div>
                </GlassPanel>
              ) : (
                <GlassPanel className="px-5 py-5">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <div className="t-eyebrow-mut">Energy Level</div>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="t-h2 !text-ink/40">
                          {isComputing ? scoreText : "—"}
                        </span>
                        <span className="t-caption">/ 100</span>
                      </div>
                      <div className="mt-2 t-caption">
                        {phase === "idle"
                          ? "Awaiting input signals…"
                          : phase === "flowing"
                            ? "Streaming raw signals into f(x)…"
                            : "Computing energy level…"}
                      </div>
                    </div>
                    <div className="shrink-0 opacity-50">
                      <CircularProgress
                        value={isComputing ? scoreText : 0}
                      />
                    </div>
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1 lg:hidden">
          <span className="t-mono">flow</span>
        </div>
      </div>
    </div>
  );
}

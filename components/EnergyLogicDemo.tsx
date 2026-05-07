"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - clamp(value, 0, 100) / 100);

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
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--accent-orange)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: dash }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
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
  return (
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 rgba(253,140,55,0)",
                "0 0 0 8px rgba(253,140,55,0.10)",
                "0 0 0 rgba(253,140,55,0)",
              ],
            }
          : { boxShadow: "0 0 0 rgba(253,140,55,0)" }
      }
      transition={{ duration: 0.9, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className="rounded-2xl"
    >
      <GlassPanel className="px-4 py-3.5">
        <div className="t-mono">{label}</div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="t-h4">{value}</span>
          <span className="t-caption">{unit}</span>
        </div>
        <div className="mt-1 t-caption">{detail}</div>
      </GlassPanel>
    </motion.div>
  );
}

function FunctionNode({ active }: { active: boolean }) {
  return (
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 rgba(253,140,55,0)",
                "0 0 0 14px rgba(253,140,55,0.14)",
                "0 0 0 rgba(253,140,55,0)",
              ],
            }
          : { boxShadow: "0 0 0 rgba(253,140,55,0)" }
      }
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      className="relative grid h-[88px] w-[88px] place-items-center rounded-full border border-white/40 bg-white/55 backdrop-blur-md"
    >
      <div className="t-body font-medium text-ink/85">f(x)</div>
      {/* spinning ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-6px] rounded-full border border-dashed border-[color:var(--accent-orange)]/35"
        animate={{ rotate: active ? 360 : 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

/** A small pulse traveling along a horizontal wire. */
function WirePulse({
  delay,
  active,
  reverse = false,
}: {
  delay: number;
  active: boolean;
  reverse?: boolean;
}) {
  return (
    <motion.span
      key={`${active}-${delay}`}
      aria-hidden
      className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[color:var(--accent-orange)]"
      initial={{ left: reverse ? "100%" : "0%", opacity: 0 }}
      animate={
        active
          ? {
              left: reverse ? ["100%", "0%"] : ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }
          : { opacity: 0 }
      }
      transition={{
        duration: 1.2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 0.4,
      }}
    />
  );
}

type Phase = "idle" | "flowing" | "computing" | "result";

export function EnergyLogicDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4, margin: "-10% 0px" });
  const [phase, setPhase] = useState<Phase>("idle");

  const scoreTarget = 85;
  const scoreMV = useMotionValue(0);
  const score = useSpring(scoreMV, { stiffness: 220, damping: 28, mass: 0.6 });
  const [scoreText, setScoreText] = useState(0);

  useEffect(() => {
    const unsub = score.on("change", (v) => setScoreText(Math.round(v)));
    return () => unsub();
  }, [score]);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const timers: number[] = [];

    function runCycle() {
      if (cancelled) return;
      setPhase("idle");
      scoreMV.set(0);

      timers.push(window.setTimeout(() => { if (!cancelled) setPhase("flowing"); }, 350));
      timers.push(window.setTimeout(() => { if (!cancelled) setPhase("computing"); }, 1300));
      timers.push(window.setTimeout(() => { if (!cancelled) scoreMV.set(scoreTarget); }, 1350));
      timers.push(window.setTimeout(() => { if (!cancelled) setPhase("result"); }, 2400));
      // pause on result, then loop
      timers.push(window.setTimeout(() => { if (!cancelled) runCycle(); }, 4000));
    }

    runCycle();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [inView, scoreMV]);

  const isFlowing = phase === "flowing" || phase === "computing";
  const isComputing = phase === "computing";
  const showResult = phase === "result";

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative w-full rounded-3xl bg-white/30 p-6 sm:p-8">
        <div aria-hidden className="absolute inset-0 grain rounded-3xl opacity-15" />

        <div className="relative mb-4 flex items-center">
          <div className="t-mono">Inputs → f(x) → Energy Level</div>
        </div>

        {/* Pipeline */}
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* Inputs column */}
          <div className="relative space-y-3">
            {INPUTS.map((input, i) => (
              <motion.div
                key={input.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.06 * i,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              >
                <InputCard
                  label={input.label}
                  value={input.value}
                  unit={input.unit}
                  detail={input.detail}
                  active={isFlowing}
                />
              </motion.div>
            ))}

            {/* wires (desktop only) — from input center to function */}
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
                    <WirePulse delay={0.15 * i} active={isFlowing} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Function node */}
          <div className="relative flex items-center justify-center">
            <FunctionNode active={isFlowing || isComputing} />
          </div>

          {/* Output column */}
          <div className="relative">
            {/* wire from function to output (desktop only) */}
            <div className="pointer-events-none absolute inset-y-0 -left-8 hidden w-8 lg:block">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink/15">
                <WirePulse delay={0.45} active={isComputing || showResult} />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                >
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
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassPanel className="px-5 py-5">
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <div className="t-eyebrow-mut">Energy Level</div>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <motion.span
                            key={scoreText}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                            className="t-h2 !text-ink/40"
                          >
                            {isComputing ? scoreText : "—"}
                          </motion.span>
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
                        <CircularProgress value={isComputing ? scoreText : 0} />
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile vertical connectors */}
        <div className="mt-4 flex flex-col items-center gap-1 lg:hidden">
          <span className="t-mono">flow</span>
        </div>
      </div>
    </div>
  );
}

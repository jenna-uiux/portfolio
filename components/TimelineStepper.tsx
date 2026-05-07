"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TimelineStep = {
  time: string;
  label: string;
  body: string;
};

const AUTO_MS = 24_000; // 0 → maxHour in 24 seconds (~1s per hour)

function parseHour(t: string) {
  const m = t.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

// ── Single flip digit panel ─────────────────────────────────
function FlipDigit({ value }: { value: number }) {
  const prevRef = useRef(value);
  const [ds, setDs] = useState({ cur: value, prev: value, active: false });

  useEffect(() => {
    const p = prevRef.current;
    if (value === p) return;
    prevRef.current = value;
    setDs({ cur: value, prev: p, active: true });
    const t = setTimeout(() => setDs((s) => ({ ...s, active: false })), 480);
    return () => clearTimeout(t);
  }, [value]);

  const ch = String(ds.cur);
  const ph = String(ds.prev);

  return (
    <div
      className="relative select-none"
      style={{ width: 68, height: 102, perspective: "480px" }}
    >
      {/* ── Static back plate ── */}
      {/* top half */}
      <div
        className="absolute inset-x-0 top-0 flex items-end justify-center overflow-hidden rounded-t-[9px] bg-[#212121]"
        style={{ height: "50%" }}
      >
        <span
          className="font-mono text-[64px] font-bold leading-none text-white/90"
          style={{ transform: "translateY(50%)" }}
        >
          {ch}
        </span>
      </div>
      {/* bottom half */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-start justify-center overflow-hidden rounded-b-[9px] bg-[#1a1a1a]"
        style={{ height: "50%" }}
      >
        <span
          className="font-mono text-[64px] font-bold leading-none text-white/75"
          style={{ transform: "translateY(-50%)" }}
        >
          {ch}
        </span>
      </div>

      {/* center divider */}
      <div className="absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-px bg-black/70" />

      {/* ── Animated flaps ── */}
      <AnimatePresence>
        {ds.active && (
          <>
            {/* top flap: prev digit, folds down and away — key forces remount on each digit change */}
            <motion.div
              key={`top-${ds.cur}`}
              className="absolute inset-x-0 top-0 z-10 flex items-end justify-center overflow-hidden rounded-t-[9px] bg-[#212121]"
              style={{ height: "50%", transformOrigin: "50% 100%" }}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              transition={{ duration: 0.22, ease: [0.55, 0, 1, 0.45] }}
            >
              <span
                className="font-mono text-[64px] font-bold leading-none text-white/90"
                style={{ transform: "translateY(50%)" }}
              >
                {ph}
              </span>
            </motion.div>

            {/* bottom flap: new digit, unfolds from top */}
            <motion.div
              key={`bot-${ds.cur}`}
              className="absolute inset-x-0 bottom-0 z-10 flex items-start justify-center overflow-hidden rounded-b-[9px] bg-[#1a1a1a]"
              style={{ height: "50%", transformOrigin: "50% 0%" }}
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.22, delay: 0.26, ease: [0, 0.55, 0.45, 1] }}
            >
              <span
                className="font-mono text-[64px] font-bold leading-none text-white/75"
                style={{ transform: "translateY(-50%)" }}
              >
                {ch}
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Confetti burst ──────────────────────────────────────────
const CONFETTI_COLORS = [
  "#FD8C37", "#FFD166", "#06D6A0", "#118AB2", "#EF476F",
  "#A8DADC", "#F4A261", "#E9C46A", "#2A9D8F", "#E76F51",
];

function ConfettiBurst({ trigger }: { trigger: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => {
        const angle = (Math.random() * 360 * Math.PI) / 180;
        const dist = 60 + Math.random() * 120;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - Math.random() * 60,
          rot: Math.random() * 720 - 360,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 5 + Math.random() * 5,
          h: 3 + Math.random() * 4,
          delay: Math.random() * 0.15,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger]
  );

  if (trigger === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={`${trigger}-${p.id}`}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.w, height: p.h, backgroundColor: p.color, marginLeft: -p.w / 2, marginTop: -p.h / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot, scale: 0.4 }}
          transition={{ duration: 0.9 + Math.random() * 0.5, delay: p.delay, ease: [0.2, 0.8, 0.4, 1] }}
        />
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────
export function TimelineStepper({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });

  const stepHours = steps.map((s) => parseHour(s.time));
  const maxHour = Math.max(...stepHours);

  const [hour, setHour] = useState(0);
  const [manual, setManual] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const prevHourRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const runAuto = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const pct = Math.min((ts - startRef.current) / AUTO_MS, 1);
      setHour(Math.round(pct * maxHour));
      if (pct < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [maxHour]);

  // Start auto-advance when in view
  useEffect(() => {
    if (!inView || manual) return;
    runAuto();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, manual, runAuto]);

  // Fire confetti when hour reaches maxHour
  useEffect(() => {
    if (hour === maxHour && prevHourRef.current < maxHour) {
      setConfettiKey((k) => k + 1);
    }
    prevHourRef.current = hour;
  }, [hour, maxHour]);

  // Current active step = last step whose hour <= displayed hour
  const activeIdx = stepHours.reduce(
    (acc, h, i) => (h <= hour ? i : acc),
    0
  );

  const tens = Math.floor(hour / 10);
  const units = hour % 10;
  const pct = (hour / maxHour) * 100;

  return (
    <div ref={ref} className="select-none">
      <div className="mt-[36px] mb-[72px] flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
        {/* ── Left: flip clock + slider ── */}
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-ink/30">
            Hour
          </span>

          {/* Clock panels */}
          <div className="relative flex items-center gap-[5px]">
            <FlipDigit value={tens} />
            <FlipDigit value={units} />
            <ConfettiBurst trigger={confettiKey} />
          </div>

          {/* Slider */}
          <div className="w-[141px]">
            <input
              type="range"
              min={0}
              max={maxHour}
              step={1}
              value={hour}
              onChange={(e) => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                setManual(true);
                setHour(Number(e.target.value));
              }}
              className={[
                "h-[3px] w-full cursor-pointer appearance-none rounded-full outline-none",
                "[&::-webkit-slider-thumb]:h-[13px] [&::-webkit-slider-thumb]:w-[13px]",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:bg-[color:var(--accent-orange)]",
                "[&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(253,140,55,0.22)]",
                "[&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb:active]:cursor-grabbing",
                "[&::-moz-range-thumb]:h-[13px] [&::-moz-range-thumb]:w-[13px]",
                "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0",
                "[&::-moz-range-thumb]:bg-[color:var(--accent-orange)]",
              ].join(" ")}
              style={{
                background: `linear-gradient(to right, var(--accent-orange) ${pct}%, rgba(23,23,23,0.14) ${pct}%)`,
              }}
            />
          </div>

          {manual && (
            <button
              onClick={() => {
                setHour(0);
                setManual(false);
              }}
              className="self-start font-sans text-[9px] uppercase tracking-[0.12em] text-ink/30 transition-colors hover:text-[color:var(--accent-orange)]"
            >
              replay ↺
            </button>
          )}
        </div>

        {/* ── Right: step content ── */}
        <div className="min-w-0 flex-1 sm:max-w-[720px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-xl border border-white/35 bg-white/50 px-5 py-4 shadow-[0_6px_20px_rgba(23,23,23,0.04)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-[color:var(--accent-orange)] bg-[color:var(--accent-orange)]/8 px-2.5 py-0.5 font-sans text-[10px] tabular-nums text-[color:var(--accent-orange)]">
                  {steps[activeIdx].time}
                </span>
                <span className="font-sans text-[10px] tabular-nums text-ink/20">
                  {activeIdx + 1} / {steps.length}
                </span>
              </div>
              <p className="mt-3 text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-ink">
                {steps[activeIdx].label}
              </p>
              <p
                className="mt-2 text-[14px] font-light leading-[1.55]"
                style={{ color: "#525252" }}
              >
                {steps[activeIdx].body}
              </p>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

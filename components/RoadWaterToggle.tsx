"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";

type Mode = "road" | "water";

type Props = {
  defaultMode?: Mode;
  caption?: string;
};

const EASE = [0.2, 0.8, 0.2, 1] as const;

export function RoadWaterToggle({
  defaultMode = "road",
  caption,
}: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const isRoad = mode === "road";

  return (
    <div className="not-prose">
      <SegmentedToggle mode={mode} onChange={setMode} />

      <div
        className="relative mt-5 overflow-hidden rounded-2xl border"
        style={{
          aspectRatio: "16 / 9",
          borderColor: "rgba(245,245,245,0.10)",
          background: "#0b0b0b",
        }}
      >
        <AnimatePresence mode="sync" initial={false}>
          {isRoad ? (
            <motion.div
              key="road-stage"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <RoadStage />
            </motion.div>
          ) : (
            <motion.div
              key="water-stage"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <WaterStage />
            </motion.div>
          )}
        </AnimatePresence>

        <ModeBadge mode={mode} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="md:col-span-2 grid gap-6 md:grid-cols-2"
          >
            {(isRoad ? ROAD_NOTES : WATER_NOTES).map((note, i) => (
              <div
                key={i}
                className="rounded-xl border px-5 py-4"
                style={{
                  borderColor: "rgba(245,245,245,0.10)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "var(--accent)" }}
                >
                  {note.label}
                </p>
                <p className="mt-2 text-[14px] leading-[1.55] text-ink/80">
                  {note.body}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {caption ? (
        <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

const ROAD_NOTES = [
  {
    label: "Driving",
    body: "Speed, traffic, and ETA sit forward. The system tracks the upcoming 50-min delay before the driver notices it.",
  },
  {
    label: "Decision",
    body: "An alternate route across water surfaces in peripheral vision, with a single piece of information — SAVE 28 min — and a one-tap accept.",
  },
];

const WATER_NOTES = [
  {
    label: "Stability",
    body: "Speed and traffic step back. Compass heading, stability, and a calm visual layer come forward.",
  },
  {
    label: "Wellness",
    body: "Subtle visual motion cues anchor the passenger's vestibular system to reduce motion sickness on water.",
  },
];

function SegmentedToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Mode"
      className="inline-flex rounded-full p-1"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(245,245,245,0.10)",
      }}
    >
      {(["road", "water"] as const).map((value) => {
        const active = mode === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className="relative z-0 inline-flex h-9 items-center gap-2 rounded-full px-5 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors"
            style={{
              color: active ? "#0b0b0b" : "rgba(245,245,245,0.7)",
            }}
          >
            {active ? (
              <motion.span
                layoutId="rwToggle"
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            ) : null}
            <span aria-hidden style={{ opacity: 0.85 }}>
              {value === "road" ? "◐" : "◑"}
            </span>
            {value === "road" ? "Road Mode" : "Water Mode"}
          </button>
        );
      })}
    </div>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  return (
    <div
      className="pointer-events-none absolute bottom-4 left-4 z-30 flex items-center gap-3"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
    >
      <span className="text-[16px] font-medium uppercase tracking-[0.16em] text-white">
        {mode === "road" ? "Road Mode" : "Water Mode"}
      </span>
      <span className="h-3 w-px bg-white/40" aria-hidden />
      <span className="text-[11px] uppercase tracking-[0.16em] text-white/75">
        {mode === "road"
          ? "Traffic-aware route adjustment"
          : "Visual motion cue for motion sickness reduction"}
      </span>
    </div>
  );
}

function RoadStage() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/aeon/hud/road-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1280px) 980px, 100vw"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <RoadCallout
        x="20%"
        y="28%"
        anchor="bottom-right"
        tone="warn"
        title="TRAFFIC AHEAD"
        sub="Extended delay 50 min"
        delay={0.15}
      />

      <RoadCallout
        x="72%"
        y="30%"
        anchor="bottom-left"
        tone="ok"
        title="Alternate route via Water"
        sub="SAVE 28 min"
        delay={0.45}
        emphasis
      />

      <SpeedReadout />

      <div className="absolute bottom-0 left-0 right-0 h-[34%]">
        <Image
          src="/images/aeon/hud/road-interior.png"
          alt=""
          fill
          className="pointer-events-none object-cover object-bottom"
          sizes="(min-width: 1280px) 980px, 100vw"
        />
      </div>
    </div>
  );
}

function WaterStage() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/aeon/hud/water-bg.png"
        alt=""
        fill
        className="object-cover"
        sizes="(min-width: 1280px) 980px, 100vw"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,30,42,0.40) 0%, rgba(15,30,42,0.10) 35%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <WaveOverlay />

      <RoadCallout
        x="26%"
        y="38%"
        anchor="bottom-right"
        tone="ok"
        title="STABILITY"
        sub="98%"
        delay={0.15}
      />

      <RoadCallout
        x="72%"
        y="36%"
        anchor="bottom-left"
        tone="ok"
        title="COMPASS"
        sub="124° NE"
        delay={0.35}
      />

      <RoadCallout
        x="50%"
        y="60%"
        anchor="bottom"
        tone="neutral"
        title="VISUAL MOTION CUE"
        sub="Active · stabilizing horizon"
        delay={0.55}
        emphasis
      />

      <div className="absolute bottom-0 left-0 right-0 h-[28%]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)",
          }}
        />
      </div>
    </div>
  );
}

function SpeedReadout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: 0.25 }}
      className="absolute left-[6%] top-[58%] flex items-baseline gap-3 text-white"
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
    >
      <div className="flex flex-col items-end leading-[1]">
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/70">
          Boost
        </span>
        <span className="mt-1 text-[15px]">x1</span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/55">
          power
        </span>
      </div>
      <div className="flex flex-col items-center leading-[1]">
        <span className="text-[44px] font-light tracking-[-0.04em]">24</span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/70">
          mph
        </span>
      </div>
      <div className="flex flex-col items-start leading-[1]">
        <span className="text-[10px] uppercase tracking-[0.22em] text-white/70">
          Range
        </span>
        <span className="mt-1 text-[15px]">346</span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-white/55">
          mi
        </span>
      </div>
    </motion.div>
  );
}

type CalloutProps = {
  x: string;
  y: string;
  anchor: "bottom-left" | "bottom-right" | "bottom";
  title: string;
  sub: string;
  tone: "warn" | "ok" | "neutral";
  delay?: number;
  emphasis?: boolean;
};

function RoadCallout({
  x,
  y,
  anchor,
  title,
  sub,
  tone,
  delay = 0,
  emphasis,
}: CalloutProps) {
  const accent =
    tone === "warn"
      ? "#FF6B6B"
      : tone === "ok"
        ? "#7CC2FF"
        : "rgba(255,255,255,0.85)";

  const translate: CSSProperties =
    anchor === "bottom-left"
      ? { transform: "translate(0%, -100%)" }
      : anchor === "bottom-right"
        ? { transform: "translate(-100%, -100%)" }
        : { transform: "translate(-50%, -100%)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="absolute z-20"
      style={{ left: x, top: y, ...translate }}
    >
      <div
        className="relative px-3 py-2 text-center"
        style={{
          textShadow: `0 0 8px ${accent}`,
          color: "rgba(255,255,255,0.95)",
        }}
      >
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {title}
        </p>
        <p
          className="mt-1 text-[12px] font-light text-white/90"
          style={{
            fontSize: emphasis ? 13 : 11,
          }}
        >
          {sub}
        </p>
      </div>
      {/* connector line */}
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-full block h-6 w-px -translate-x-1/2"
        style={{ background: accent }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: delay + 0.2 }}
      />
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-[calc(100%+24px)] block h-2 w-2 -translate-x-1/2 rotate-45 border"
        style={{ borderColor: accent }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: delay + 0.35 }}
      />
    </motion.div>
  );
}

function WaveOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-60"
    >
      <svg
        viewBox="0 0 1600 220"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: "32%" }}
      >
        <motion.path
          d="M0 110 Q 200 60 400 110 T 800 110 T 1200 110 T 1600 110"
          stroke="rgba(124,194,255,0.55)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <motion.path
          d="M0 140 Q 200 100 400 140 T 800 140 T 1200 140 T 1600 140"
          stroke="rgba(124,194,255,0.35)"
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
        />
        <motion.path
          d="M0 80 Q 200 40 400 80 T 800 80 T 1200 80 T 1600 80"
          stroke="rgba(124,194,255,0.22)"
          strokeWidth="0.6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        />
      </svg>
    </div>
  );
}

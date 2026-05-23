"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Full ModesShowcase matching Figma slides 1153:2007, 1153:2097, 1153:2187.
 *
 * Renders:
 *   1. Road Mode · base state (cabin + highway + "TRAFFIC AHEAD" callout)
 *   2. Road Mode · alternate route revealed (same + blue "Alternate route via Water" callout)
 *   3. Interactive Road ↔ Water toggle showing the final state of each mode
 */
export function ModesShowcase() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Stacked 1 — Road Mode base */}
      <ModeFrame
        modeLabel="ROAD MODE"
        modeSubLabel="Traffic-aware route adjustment"
        bgImage="/images/aeon/hud/road-bg.png"
        interiorImage="/images/aeon/hud/road-interior.png"
        showTrafficCallout
      />

      {/* Stacked 2 — Road Mode with alternate route */}
      <ModeFrame
        modeLabel="ROAD MODE"
        modeSubLabel="Alternate route surfaced in peripheral vision"
        bgImage="/images/aeon/hud/road-bg.png"
        interiorImage="/images/aeon/hud/road-interior.png"
        showTrafficCallout
        showAlternateRoute
      />

      {/* Interactive toggle — Road ↔ Water final states */}
      <InteractiveToggle />
    </div>
  );
}

/* ───────────────────── Stacked ModeFrame ───────────────────── */

function ModeFrame({
  modeLabel,
  modeSubLabel,
  bgImage,
  interiorImage,
  showTrafficCallout = false,
  showAlternateRoute = false,
}: {
  modeLabel: string;
  modeSubLabel: string;
  bgImage: string;
  interiorImage: string;
  showTrafficCallout?: boolean;
  showAlternateRoute?: boolean;
}) {
  return (
    <div className="not-prose">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9", background: "#0a0a0a" }}
      >
        {/* Highway / road BG */}
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 768px) 80vw, 100vw"
        />
        {/* Slight darkening */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.42)" }}
        />

        {/* Cabin interior overlay (transparent windshield reveals BG) */}
        <div className="absolute inset-0">
          <Image
            src={interiorImage}
            alt=""
            fill
            className="object-cover object-bottom"
            sizes="(min-width: 768px) 80vw, 100vw"
          />
        </div>

        {/* HUD callouts */}
        {showTrafficCallout ? (
          <TrafficCallout />
        ) : null}
        {showAlternateRoute ? (
          <AlternateRouteCallout />
        ) : null}

        {/* Top eyebrow */}
        <div
          className="absolute left-6 top-5 md:left-10 md:top-7"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
            padding: "4px 8px",
            borderRadius: 4,
          }}
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "rgba(231,231,231,0.85)" }}
          >
            UI / UX Design
          </p>
          <p
            className="mt-0.5 text-[16px] font-medium"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            Proof of Concept
          </p>
        </div>

        {/* Bottom mode label */}
        <div
          className="absolute bottom-6 left-6 md:bottom-10 md:left-10"
          style={{
            textShadow: "0 0 12px rgba(0,0,0,0.55)",
          }}
        >
          <div className="flex flex-wrap items-baseline gap-3 md:gap-5">
            <p
              className="font-semibold uppercase tracking-[-0.01em]"
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "clamp(16px, 2vw, 22px)",
              }}
            >
              {modeLabel}
            </p>
            <p
              className="uppercase tracking-[-0.005em]"
              style={{
                color: "rgba(213,213,213,0.85)",
                fontSize: "clamp(11px, 1.2vw, 14px)",
              }}
            >
              {modeSubLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrafficCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
      className="absolute"
      style={{
        left: "26%",
        top: "32%",
      }}
    >
      {/* Diamond marker */}
      <motion.div
        className="absolute -translate-x-1/2"
        style={{ left: "50%", top: "-16px" }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            transform: "rotate(45deg)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 8px #f22c30",
          }}
        />
      </motion.div>
      <p
        className="whitespace-nowrap text-center font-semibold"
        style={{
          color: "rgba(255,255,255,0.95)",
          fontSize: "clamp(11px, 1.3vw, 16px)",
          letterSpacing: "0.04em",
          textShadow: "0 0 6px rgba(242,44,48,0.8)",
        }}
      >
        TRAFFIC AHEAD
      </p>
      <p
        className="mt-1 whitespace-nowrap text-center"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "clamp(9px, 1vw, 12px)",
        }}
      >
        Extended Delay 50 min
      </p>
    </motion.div>
  );
}

function AlternateRouteCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
      className="absolute"
      style={{
        right: "16%",
        top: "32%",
      }}
    >
      {/* Diamond marker */}
      <motion.div
        className="absolute -translate-x-1/2"
        style={{ left: "50%", top: "-16px" }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            transform: "rotate(45deg)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 8px #2ca3f2",
          }}
        />
      </motion.div>
      <p
        className="whitespace-nowrap text-center font-semibold"
        style={{
          color: "rgba(255,255,255,0.95)",
          fontSize: "clamp(11px, 1.3vw, 16px)",
          letterSpacing: "0.04em",
          textShadow: "0 0 6px rgba(44,163,242,0.8)",
        }}
      >
        Alternate route via Water
      </p>
      <p
        className="mt-1 whitespace-nowrap text-center"
        style={{
          color: "rgba(44,163,242,0.95)",
          fontSize: "clamp(9px, 1vw, 12px)",
          fontWeight: 500,
          letterSpacing: "0.08em",
        }}
      >
        SAVE 28 MIN
      </p>
    </motion.div>
  );
}

/* ───────────────────── Interactive Toggle ───────────────────── */

type Mode = "road" | "water";

function InteractiveToggle() {
  const [mode, setMode] = useState<Mode>("road");
  const isRoad = mode === "road";

  return (
    <div className="not-prose">
      {/* Segmented control */}
      <div
        className="mb-5 inline-flex rounded-full border p-1"
        style={{
          borderColor: "rgba(245,245,245,0.10)",
          background: "rgba(255,255,255,0.025)",
        }}
      >
        {(["road", "water"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="relative rounded-full px-5 py-2 text-[12px] font-medium tracking-[0.18em] uppercase transition-colors"
            style={{
              color: mode === m ? "rgba(10,10,10,1)" : "rgba(245,245,245,0.7)",
              zIndex: 1,
            }}
          >
            {mode === m ? (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "rgba(245,245,245,0.95)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative">{m === "road" ? "Road" : "Water"}</span>
          </button>
        ))}
      </div>

      {/* Stage */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16 / 9", background: "#0a0a0a" }}
      >
        <AnimatePresence mode="sync" initial={false}>
          {isRoad ? (
            <motion.div
              key="road"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Road BG */}
              <Image
                src="/images/aeon/hud/road-bg.png"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 768px) 80vw, 100vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.42)" }}
              />
              <Image
                src="/images/aeon/hud/road-interior.png"
                alt=""
                fill
                className="object-cover object-bottom"
                sizes="(min-width: 768px) 80vw, 100vw"
              />
              <TrafficCallout />
              <AlternateRouteCallout />
              <ModeLabel
                label="ROAD MODE"
                sub="Traffic-Aware Route Adjustment"
              />
            </motion.div>
          ) : (
            <motion.div
              key="water"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Water Mode */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #1a2a3a 0%, #0d1a26 50%, #050a12 100%)",
                }}
              />
              <Image
                src="/images/aeon/hud/water-bg.png"
                alt=""
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 80vw, 100vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.38)" }}
              />
              <Image
                src="/images/aeon/hud/road-interior.png"
                alt=""
                fill
                className="object-cover object-bottom opacity-90"
                sizes="(min-width: 768px) 80vw, 100vw"
              />
              <StabilityCallout />
              <ModeLabel
                label="WATER MODE"
                sub="Visual Motion Cue for Motion Sickness Reduction"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StabilityCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: "28%" }}
    >
      <p
        className="text-center"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: "clamp(12px, 1.4vw, 16px)",
          letterSpacing: "0.16em",
          textShadow: "0 0 12px rgba(0,180,220,0.5)",
        }}
      >
        STABILITY
      </p>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: "rgba(124,194,255,0.85)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ModeLabel({ label, sub }: { label: string; sub: string }) {
  return (
    <div
      className="absolute bottom-6 left-6 md:bottom-10 md:left-10"
      style={{ textShadow: "0 0 12px rgba(0,0,0,0.55)" }}
    >
      <div className="flex flex-wrap items-baseline gap-3 md:gap-5">
        <p
          className="font-semibold uppercase tracking-[-0.01em]"
          style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: "clamp(16px, 2vw, 22px)",
          }}
        >
          {label}
        </p>
        <p
          className="uppercase tracking-[-0.005em]"
          style={{
            color: "rgba(213,213,213,0.85)",
            fontSize: "clamp(11px, 1.2vw, 14px)",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export type FlipCardData = {
  label: string;
  title: string;
  front: string;
  back: string;
  backLabel?: string;
};

function FlipCard({ card }: { card: FlipCardData }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const teaseY = reduceMotion
    ? flipped
      ? 180
      : 0
    : flipped
      ? hovered
        ? 166
        : 180
      : hovered
        ? 13
        : 0;

  return (
    <button
      className="group relative h-[230px] w-full cursor-pointer text-left [perspective:1200px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${card.label}: ${card.title}. ${flipped ? "Showing user feedback. Click to flip back." : "Click to reveal user feedback."}`}
    >
      <motion.div
        className="relative h-full w-full origin-center [transform-style:preserve-3d]"
        animate={{ rotateY: teaseY }}
        transition={
          hovered
            ? { type: "spring", stiffness: 320, damping: 24, mass: 0.85 }
            : { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }
        }
        whileTap={
          reduceMotion
            ? undefined
            : {
                rotateY: flipped ? 172 : 7,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }
        }
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col rounded-2xl border border-white/35 bg-white/50 p-5 shadow-[0_6px_24px_rgba(23,23,23,0.05)] backdrop-blur-md [backface-visibility:hidden]">
          <span className="inline-flex w-fit rounded-full border border-[color:var(--accent-orange)] bg-[color:var(--accent-orange)]/8 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--accent-orange)]">
            {card.label}
          </span>
          <h4 className="mt-3 text-[16px] font-medium leading-[1.3] tracking-[-0.02em] text-ink">
            {card.title}
          </h4>
          <p
            className="mt-2 flex-1 text-[14px] font-light leading-[1.55]"
            style={{ color: "#525252" }}
          >
            {card.front}
          </p>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink/25 transition-colors group-hover:text-[color:var(--accent-orange)]/55">
            <span>Tap for feedback</span>
            <span>→</span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col rounded-2xl bg-[#171717] p-5 shadow-[0_8px_32px_rgba(23,23,23,0.18)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className={[
            "inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
            card.backLabel
              ? "bg-[color:var(--accent-orange)]/15 text-[color:var(--accent-orange)]/80"
              : "bg-white/10 text-white/45",
          ].join(" ")}>
            {card.backLabel ?? "User Feedback"}
          </span>
          <p className={[
            "mt-3 flex-1 text-[14px] leading-[1.6]",
            card.backLabel
              ? "font-light text-white/75"
              : "font-light italic text-white/80",
          ].join(" ")}>
            {card.back}
          </p>
          <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/20">
            Click to flip back
          </div>
        </div>
      </motion.div>
    </button>
  );
}

export function InsightFlipCards({ cards }: { cards: FlipCardData[] }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {cards.map((card, i) => (
        <FlipCard key={i} card={card} />
      ))}
    </div>
  );
}

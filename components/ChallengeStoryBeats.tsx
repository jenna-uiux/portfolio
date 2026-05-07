"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Beat = {
  eyebrow?: string;
  stat?: {
    value: string;
    label: string;
    source?: string;
    detail?: string;
  };
  body: string;
  highlight?: string;
  listItems?: { type: "disappear" | "survive"; text: string }[];
};

const KICKER = "t-eyebrow";

/* ─── Beat 1: Animated counter ─── */
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const steps = 60;
    const increment = target / steps;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const next = Math.min(Math.round(increment * frame), target);
      setCount(next);
      if (next >= target) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Beat 2: Clickable task simulator ─── */
function TaskSimulator({
  items,
}: {
  items: { type: "disappear" | "survive"; text: string }[];
}) {
  const disappear = items.filter((i) => i.type === "disappear");
  const survive = items.filter((i) => i.type === "survive");
  const [struck, setStruck] = useState<Set<number>>(new Set());
  const [hinted, setHinted] = useState(false);

  const toggle = (i: number) => {
    setStruck((prev) => {
      const next = new Set(prev);
      if (next.has(i)) { next.delete(i); } else { next.add(i); }
      return next;
    });
    setHinted(true);
  };

  const allStruck = struck.size === disappear.length;

  return (
    <div className="mt-7">
      {!hinted && (
        <p className="mb-5 t-mono">
          Click to cross off your plans →
        </p>
      )}
      <div className="grid max-w-[52ch] grid-cols-2 gap-x-10">
        <div>
          <p className="mb-4 t-mono">Your plans</p>
          <ul className="space-y-3">
            {disappear.map((li, j) => (
              <li
                key={j}
                onClick={() => toggle(j)}
                className={[
                  "cursor-pointer select-none transition-all duration-400 t-body-sm",
                  struck.has(j)
                    ? "!text-ink/25 line-through decoration-ink/20"
                    : "hover:!text-ink",
                ].join(" ")}
              >
                {li.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 t-mono">What survives</p>
          <ul className="space-y-3">
            {survive.map((li, j) => (
              <li
                key={j}
                className="flex items-center gap-2 t-body-sm"
              >
                <span aria-hidden className="text-[10px] text-orange">
                  →
                </span>
                {li.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {allStruck && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-7 text-[1.1rem] text-orange"
        >
          Sound familiar?
        </motion.p>
      )}
    </div>
  );
}


/* ─── Beat 1 helper: parse stat value and render ─── */
function StatBlock({
  stat,
}: {
  stat: { value: string; label: string; source?: string; detail?: string };
}) {
  const numMatch = stat.value.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = stat.value.replace(/\d+/, "");
  const [hover, setHover] = useState(false);
  const hasReveal = Boolean(stat.source || stat.detail);

  return (
    <div className="mt-6">
      <div
        className="group inline-flex items-baseline gap-5"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        tabIndex={hasReveal ? 0 : undefined}
        role={hasReveal ? "button" : undefined}
        aria-label={hasReveal ? `${stat.value}, hover for source` : undefined}
      >
        <span
          className={[
            "relative t-stat transition-colors duration-300",
            hasReveal ? "cursor-help" : "",
          ].join(" ")}
        >
          <AnimatedCounter target={num} suffix={suffix} />
          {hasReveal && (
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px bg-orange/50"
              initial={{ width: 0 }}
              animate={{ width: hover ? "100%" : "30%" }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            />
          )}
        </span>
        <span className="max-w-[20ch] t-caption">{stat.label}</span>
      </div>

      <AnimatePresence>
        {hasReveal && hover && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-4 flex items-center gap-2 t-mono"
          >
            <span aria-hidden className="h-px w-6 bg-ink/30" />
            <span>
              {stat.detail ? `${stat.detail} · ` : ""}
              {stat.source ? `Source: ${stat.source}` : ""}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main component ─── */
export function ChallengeStoryBeats({ beats }: { beats: Beat[] }) {
  return (
    <div>
      {beats.map((beat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{
            duration: 0.7,
            delay: 0.04 * i,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="border-t hairline p-0 first:border-t-0"
        >
          {/* Eyebrow kicker */}
          {beat.eyebrow && <p className={KICKER}>{beat.eyebrow}</p>}

          {/* Beat 1 — animated stat */}
          {beat.stat && <StatBlock stat={beat.stat} />}

          {beat.highlight && beat.highlight === beat.body && (
            <p className="mt-6 w-full max-w-none t-h2">
              {beat.highlight}
            </p>
          )}

          {beat.highlight && beat.highlight !== beat.body && (
            <>
              <h3 className="w-full max-w-none t-h3">
                {beat.highlight}
              </h3>
              {beat.body && (
                <p className="mt-5 w-full max-w-none t-body">
                  {beat.body}
                </p>
              )}
            </>
          )}

          {beat.body && !beat.highlight && (
            <p className="mt-5 w-full max-w-none t-body">
              {beat.body}
            </p>
          )}

          {/* Beat 2 — interactive task simulator */}
          {beat.listItems && beat.listItems.length > 0 && (
            <TaskSimulator items={beat.listItems} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

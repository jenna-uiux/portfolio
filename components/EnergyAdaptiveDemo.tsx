"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type EnergyLevel = "low" | "mid" | "high";

type Task = {
  id: string;
  title: string;
  type: "deep" | "light" | "physical" | "recovery";
  durationByLevel: Record<EnergyLevel, string>;
  showAt: EnergyLevel[];
  emphasizeAt?: EnergyLevel[];
};

const TASKS: Task[] = [
  {
    id: "deep-work",
    title: "Deep work — Design review",
    type: "deep",
    durationByLevel: { low: "Tomorrow", mid: "2 hr", high: "2 hr" },
    showAt: ["mid", "high"],
    emphasizeAt: ["high"],
  },
  {
    id: "light-admin",
    title: "Light admin — Reply emails",
    type: "light",
    durationByLevel: { low: "30 min", mid: "30 min", high: "15 min" },
    showAt: ["low", "mid", "high"],
  },
  {
    id: "workout",
    title: "Workout",
    type: "physical",
    durationByLevel: { low: "Tomorrow", mid: "45 min", high: "45 min" },
    showAt: ["low", "mid", "high"],
  },
  {
    id: "recovery",
    title: "Recovery walk",
    type: "recovery",
    durationByLevel: { low: "20 min", mid: "20 min", high: "20 min" },
    showAt: ["low"],
  },
];

function getLevel(value: number): EnergyLevel {
  if (value < 34) return "low";
  if (value < 67) return "mid";
  return "high";
}

const LEVEL_LABELS: Record<EnergyLevel, string> = {
  low: "Low energy",
  mid: "Balanced",
  high: "High energy",
};

const LEVEL_NOTES: Record<EnergyLevel, string> = {
  low: "Deep work moves to tomorrow. A recovery walk is suggested.",
  mid: "Standard plan with balanced tasks.",
  high: "Deep work surfaces first. Light admin compresses.",
};

export function EnergyAdaptiveDemo() {
  const [value, setValue] = useState(50);
  const level = getLevel(value);

  const visible = TASKS.filter((t) => t.showAt.includes(level));
  const ordered =
    level === "high"
      ? [...visible].sort((a, b) => {
          const order = { deep: 0, physical: 1, light: 2, recovery: 3 };
          return order[a.type] - order[b.type];
        })
      : visible;

  return (
    <figure className="my-2 overflow-hidden rounded-2xl border hairline bg-surface-solid">
      <div className="grid gap-0 md:grid-cols-2">
        {/* Left — slider control */}
        <div className="flex flex-col justify-between p-8 md:p-10">
          <div>
            <p className="t-eyebrow">Try it · Drag your energy</p>
            <p className="mt-3 max-w-[28ch] t-lead">
              The schedule adapts to you, not the other way around.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <span className="t-mono">Energy</span>
              <span className="t-eyebrow">{LEVEL_LABELS[level]}</span>
            </div>

            <div className="relative mt-3">
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                aria-label="Energy level"
                className="energy-slider w-full"
              />
              <div className="mt-2 flex justify-between t-mono">
                <span>Low</span>
                <span>Mid</span>
                <span>High</span>
              </div>
            </div>

            <p className="mt-5 max-w-[36ch] t-caption">{LEVEL_NOTES[level]}</p>
          </div>
        </div>

        {/* Right — adaptive plan card */}
        <div className="border-t hairline bg-bg p-8 md:border-l md:border-t-0 md:p-10">
          <div className="flex items-center justify-between">
            <p className="t-mono">Today · Mon 9:00 AM</p>
            <motion.span
              key={level}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="t-mono"
            >
              {visible.length} tasks
            </motion.span>
          </div>

          <motion.ul layout className="mt-5 space-y-2">
            <AnimatePresence initial={false}>
              {ordered.map((task) => {
                const emphasized = task.emphasizeAt?.includes(level);
                const deferred = task.durationByLevel[level] === "Tomorrow";
                const isNew = task.id === "recovery" && level === "low";

                return (
                  <motion.li
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className={[
                      "flex items-center justify-between gap-4 rounded-xl border hairline px-4 py-3 transition-colors",
                      emphasized
                        ? "border-orange/40 bg-orange/[0.06]"
                        : deferred
                        ? "bg-ink/[0.02] opacity-60"
                        : "bg-surface-solid",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden
                        className={[
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          emphasized ? "bg-orange" : "bg-ink/25",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "truncate t-body-sm",
                          emphasized ? "!text-ink font-medium" : "",
                        ].join(" ")}
                      >
                        {task.title}
                      </span>
                      {isNew && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="shrink-0 rounded-full bg-orange/15 px-2 py-0.5 t-mono !text-orange"
                        >
                          New
                        </motion.span>
                      )}
                    </div>
                    <motion.span
                      key={task.durationByLevel[level]}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={[
                        "shrink-0 t-mono",
                        deferred ? "!text-ink/35" : "",
                      ].join(" ")}
                    >
                      {task.durationByLevel[level]}
                    </motion.span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>

      <style jsx>{`
        .energy-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: linear-gradient(
            to right,
            var(--accent-orange) 0%,
            var(--accent-orange) ${value}%,
            rgba(23, 23, 23, 0.1) ${value}%,
            rgba(23, 23, 23, 0.1) 100%
          );
          border-radius: 999px;
          outline: none;
        }
        .energy-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #fff;
          border: 2px solid var(--accent-orange);
          cursor: grab;
          box-shadow: 0 2px 10px rgba(253, 140, 55, 0.35);
          transition: transform 0.15s ease;
        }
        .energy-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.08);
        }
        .energy-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #fff;
          border: 2px solid var(--accent-orange);
          cursor: grab;
          box-shadow: 0 2px 10px rgba(253, 140, 55, 0.35);
        }
      `}</style>
    </figure>
  );
}

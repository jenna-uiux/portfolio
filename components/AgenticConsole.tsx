"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type LogType = "sys" | "agent" | "warn" | "intent" | "userPrompt" | "status";

type LogEntry = {
  text: string;
  type: LogType;
};

const LOGS: LogEntry[] = [
  { text: "[USER_PROMPT]", type: "userPrompt" },
  {
    text: '"Act as a Senior Software Engineer and Systems Architect. Conduct a rigorous code audit of the Fini energy model. Specifically, I suspect that raw heart rate averages include noise from physical activity, which skews the \'Resting Energy\' inference. Refactor the HealthKitService to prioritize Resting Heart Rate (RHR) and optimize asynchronous data fetching to eliminate the 0.8s UI lag."',
    type: "userPrompt",
  },
  { text: "[CURSOR_AGENT] Optimizing HealthKit Engine...", type: "agent" },
  {
    text: "Refactoring: Migrated getAverageHeartRate → getRestingHeartRate for accuracy.",
    type: "agent",
  },
  {
    text: "Architecture: Extracted shared logic to JSONParsingUtility.swift (Reduced redundancy by 60%).",
    type: "agent",
  },
  {
    text: "Stability: 12 force unwraps replaced with safe optional binding.",
    type: "agent",
  },
  {
    text: "Performance: Implemented 1-hour cache for HealthKit queries to reduce latency.",
    type: "agent",
  },
  { text: "[SYSTEM_STATUS]", type: "status" },
  {
    text: "Inference Accuracy: +15% ↑ | Crash Risk: 0% | Response Time: <0.1s",
    type: "status",
  },
];

const DELAY_MS: Record<LogType, number> = {
  sys: 320,
  agent: 380,
  warn: 480,
  intent: 950,
  userPrompt: 720,
  status: 420,
};

function lineClasses(type: LogType): string {
  switch (type) {
    case "intent":
    case "userPrompt":
      return "whitespace-pre-wrap text-[#2DD4BF] [text-shadow:0_0_10px_rgba(45,212,191,0.45)] my-1.5 rounded-md bg-[#2DD4BF]/6 px-3 py-1.5 ring-1 ring-[#2DD4BF]/15";
    case "status":
      return "my-2 whitespace-pre-wrap text-emerald-300/95 [text-shadow:0_0_8px_rgba(110,231,183,0.35)]";
    case "warn":
      return "text-yellow-400";
    case "agent":
      return "whitespace-pre-wrap text-white/80";
    case "sys":
      return "text-white/38";
  }
}

export function AgenticConsole() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.35 });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!inView || visible >= LOGS.length) return;
    const delay = DELAY_MS[LOGS[visible].type];
    const t = setTimeout(() => setVisible((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [inView, visible]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visible]);

  return (
    <div
      ref={rootRef}
      className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-[#0E0E0E]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]/65" />
        <span className="h-3 w-3 rounded-full bg-[#FEBC2E]/65" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]/65" />
        <span className="ml-3 font-mono text-[11px] text-white/25">
          HealthKitService — cursor-agent
        </span>
      </div>

      {/* Log output */}
      <div
        ref={scrollRef}
        className="h-[300px] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-[1.75] sm:h-[340px]"
      >
        {LOGS.slice(0, visible).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={lineClasses(log.type)}
          >
            {log.text}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visible < LOGS.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
            className="mt-0.5 inline-block h-4 w-2 rounded-sm bg-white/45"
          />
        )}
      </div>
    </div>
  );
}

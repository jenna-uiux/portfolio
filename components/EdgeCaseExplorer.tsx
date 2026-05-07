"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Tab = "missing" | "contextual";

const panelEase: [number, number, number, number] = [0.45, 0, 0.55, 1];
const panelTransition = {
  type: "tween" as const,
  duration: 0.65,
  ease: panelEase,
};

/* ── Shell ────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string }[] = [
  { id: "missing", label: "Data Void" },
  { id: "contextual", label: "Accessibility Gap" },
];

export function EdgeCaseExplorer() {
  const [active, setActive] = useState<Tab>("missing");
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((prev) => (prev === "missing" ? "contextual" : "missing"));
    }, 12_000);
    return () => clearInterval(t);
  }, [paused]);

  const handleTab = (tab: Tab) => {
    setActive(tab);
    setPaused(true);
    if (pauseRef.current) clearTimeout(pauseRef.current);
    pauseRef.current = setTimeout(() => setPaused(false), 30_000);
  };

  return (
    <div className="mt-8">
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTab(id)}
            className={[
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
              active === id
                ? "border-ink/70 bg-ink text-bg"
                : "border-ink/15 bg-white text-ink/60 hover:border-ink/30 hover:text-ink/80",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Panel: two slides in one row, ease-in-out horizontal pan */}
      <div className="relative mt-4 w-full overflow-hidden">
        <motion.div
          className="flex w-[200%]"
          animate={{ x: active === "missing" ? "0%" : "-50%" }}
          transition={panelTransition}
        >
          <div className="box-border w-1/2 shrink-0">
            <Image
              src="/media/fini/design-build/edgeCase_1.jpg?v=2"
              alt="Smart Estimation — edge case when bio-data is missing and 7-day pattern fallback"
              width={1920}
              height={973}
              className="h-auto w-full max-w-full rounded-xl border border-ink/10"
              sizes="(min-width: 768px) 70vw, 100vw"
            />
          </div>
          <div className="box-border w-1/2 shrink-0">
            <Image
              src="/media/fini/design-build/edgeCase_2.jpg?v=1"
              alt="Beyond the Smartphone — Fini extended to Apple Watch for a zero-barrier next step"
              width={1920}
              height={973}
              className="h-auto w-full max-w-full rounded-xl border border-ink/10"
              sizes="(min-width: 768px) 70vw, 100vw"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

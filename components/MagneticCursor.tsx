"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorVariant = "read" | "visit" | null;

const LABELS: Record<NonNullable<CursorVariant>, string> = {
  read: "Read",
  visit: "Visit",
};

const ARROWS: Record<NonNullable<CursorVariant>, string> = {
  read: "→",
  visit: "↗",
};

export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>(null);

  const x = useSpring(0, { stiffness: 350, damping: 28, mass: 0.4 });
  const y = useSpring(0, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target as HTMLElement | null;
      const cursorEl = el?.closest?.("[data-cursor]") as HTMLElement | null;

      // Interactive elements (links, buttons) keep their Read/Visit cursor,
      // even inside a stamp zone.
      if (cursorEl) {
        if (!visible) setVisible(true);
        const next = (cursorEl.dataset.cursor as CursorVariant) ?? null;
        setVariant((prev) => (prev === next ? prev : next));
        return;
      }

      // Over a stamp zone's background the footer renders its own stamp-shaped
      // cursor, so hide the global one to avoid doubling up.
      if (el?.closest?.("[data-stamp-zone]")) {
        if (visible) setVisible(false);
        setVariant(null);
        return;
      }

      if (!visible) setVisible(true);
      setVariant(null);
    };

    const onLeave = () => {
      setVisible(false);
      setVariant(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onMove);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const active = variant !== null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="grid place-items-center rounded-full bg-white text-black"
        animate={{
          width: active ? 88 : 12,
          height: active ? 88 : 12,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {active ? (
            <motion.span
              key={variant}
              className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span>{LABELS[variant!]}</span>
              <span aria-hidden>{ARROWS[variant!]}</span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

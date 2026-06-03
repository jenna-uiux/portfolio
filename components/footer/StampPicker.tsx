"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BINARY_MARKS, MARK_BY_ID, type MarkId } from "./binaryMarks";
import { BinaryGlyph } from "./BinaryGlyph";

/* A small popover sticker pack. The button shows the active mark; opening it
   reveals the seven marks, and picking one becomes the stamp the cursor
   carries. Marked data-no-stamp so clicks here never drop a footprint. */
export function StampPicker({
  active,
  onChange,
}: {
  active: MarkId;
  onChange: (id: MarkId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const activeMark = MARK_BY_ID[active];

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block" data-no-stamp>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#f5f0e8] py-2 pl-2 pr-5 text-[#0a0a0a] shadow-[0_12px_34px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a0a0a] text-[#f5f0e8]">
          <BinaryGlyph mark={activeMark} seed={active} size={26} density="thumb" />
        </span>
        <span className="t-mono !text-[#0a0a0a]">Change stamp</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label="Stamp pack"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 z-20 mb-3 flex gap-1.5 rounded-2xl border border-[#f5f0e8]/15 bg-[#141414] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
          >
            {BINARY_MARKS.map((mark) => {
              const isActive = mark.id === active;
              return (
                <button
                  key={mark.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  aria-label={mark.label}
                  onClick={() => {
                    onChange(mark.id);
                    setOpen(false);
                  }}
                  className={[
                    "grid h-12 w-12 cursor-pointer place-items-center rounded-xl border transition-all duration-200",
                    isActive
                      ? "border-[#f5f0e8]/40 bg-[#f5f0e8]/[0.08]"
                      : "border-transparent hover:border-[#f5f0e8]/20 hover:bg-[#f5f0e8]/[0.04]",
                  ].join(" ")}
                >
                  <BinaryGlyph
                    mark={mark}
                    seed={mark.id}
                    size={34}
                    density="thumb"
                    className={isActive ? "text-[#f5f0e8]" : "text-[#f5f0e8]/85"}
                  />
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

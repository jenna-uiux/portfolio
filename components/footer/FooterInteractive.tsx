"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { site } from "@/lib/site";
import { FooterNav } from "./FooterNav";
import { StampPicker } from "./StampPicker";
import { BinaryGlyph } from "./BinaryGlyph";
import { MARK_BY_ID, type MarkId } from "./binaryMarks";

const SERIF = '"Instrument Serif", serif';
const STAMP = 56;
const MAX_PLACED = 24;
// Elements that should never trigger a stamp (and where the normal cursor
// shows instead of the stamp follower).
const INTERACTIVE = 'a, button, input, [role="option"], [data-no-stamp]';

type Placed = {
  key: string;
  markId: MarkId;
  seed: number;
  xPct: number;
  yPct: number;
};

export function FooterInteractive() {
  const [active, setActive] = useState<MarkId>("dog");
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [fine, setFine] = useState(false);
  const [overCanvas, setOverCanvas] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Raw motion values → the stamp tracks the pointer 1:1 with no spring lag.
  // framer-motion writes the transform on the next frame, off the React
  // render path, so moving the pointer never re-renders the heavy SVG.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const place = useCallback(
    (xPct: number, yPct: number) => {
      setPlaced((prev) => {
        const next: Placed[] = [
          ...prev,
          {
            key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            markId: active,
            seed: Math.floor(Math.random() * 1e9),
            xPct,
            yPct,
          },
        ];
        return next.length > MAX_PLACED
          ? next.slice(next.length - MAX_PLACED)
          : next;
      });
    },
    [active],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!fine) return;
      x.set(e.clientX);
      y.set(e.clientY);
      const next = !(e.target as HTMLElement).closest(INTERACTIVE);
      // Only flip state on an actual boundary crossing — avoids a setState
      // call on every single pointer move.
      setOverCanvas((prev) => (prev === next ? prev : next));
    },
    [fine, x, y],
  );

  const onPointerLeave = useCallback(() => setOverCanvas(false), []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(INTERACTIVE)) return;
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      place(xPct, yPct);
    },
    [place],
  );

  const activeMark = MARK_BY_ID[active];

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      style={fine && overCanvas ? { cursor: "none" } : undefined}
    >
      {/* Placed stamps — sit behind the content so text stays readable. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none text-[#f5f0e8]"
        aria-hidden
      >
        <AnimatePresence>
          {placed.map((p) => (
            <motion.div
              key={p.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, scale: 1.35 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              transition={
                reduce
                  ? { duration: 0.18 }
                  : { type: "spring", stiffness: 520, damping: 24, mass: 0.6 }
              }
            >
              <BinaryGlyph
                mark={MARK_BY_ID[p.markId]}
                seed={p.seed}
                size={STAMP}
                density="full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer content. */}
      <div
        className="relative z-10 container-ultra"
        style={{
          paddingTop: "clamp(4.5rem, 6vw, 6.5rem)",
          paddingBottom: "clamp(2.5rem, 4vw, 3.5rem)",
        }}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.035em] text-[#f5f0e8]">
              <span style={{ fontWeight: 500 }}>Leave a </span>
              <span className="italic" style={{ fontFamily: SERIF }}>
                footprint
              </span>
              <br />
              <span style={{ fontWeight: 500 }}>in my </span>
              <span className="italic" style={{ fontFamily: SERIF }}>
                footer
              </span>
              <span className="footprint-emoji ml-2" aria-hidden>
                👣
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f5f0e8]/55">
              Your cursor is a stamp down here. Click anywhere to leave a mark —
              or change the stamp first. Nothing is saved; it is just a small
              bit of fun on the way out.
            </p>

            <div className="mt-7">
              <StampPicker active={active} onChange={setActive} />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6 lg:pt-1">
            <FooterNav dark />
          </div>
        </div>

        <div className="mt-16 flex justify-end md:mt-24">
          <span className="t-mono">{site.footer.copyright}</span>
        </div>
      </div>

      {/* Cursor-following stamp (fine pointers only). */}
      {fine ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[55]"
          style={{ x, y, willChange: "transform" }}
          animate={{ opacity: overCanvas ? 0.9 : 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 text-[#f5f0e8]">
            <BinaryGlyph
              mark={activeMark}
              seed={`cursor-${active}`}
              size={STAMP}
              density="full"
            />
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

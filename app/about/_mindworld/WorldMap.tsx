"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import s from "./WorldMap.module.css";
import type { Island, IslandKey } from "./data";

type Props = {
  islands: Island[];
  visible: boolean;
  onSelect: (key: IslandKey) => void;
};

export function WorldMap({ islands, visible, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const helperRef = useRef<HTMLParagraphElement | null>(null);
  const revealedRef = useRef(false);

  // Stagger reveal first time it becomes visible
  useGSAP(
    () => {
      if (!visible || revealedRef.current) return;
      revealedRef.current = true;

      gsap.fromTo(
        `.${s.hotspot}`,
        { y: 12, opacity: 0, scale: 0.7 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: { each: 0.18, from: "random" },
          delay: 0.2,
        }
      );

      if (helperRef.current) {
        gsap.fromTo(
          helperRef.current,
          { y: -8, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.6 }
        );
      }
    },
    { dependencies: [visible], scope: wrapRef }
  );

  // Pointer-events follow visibility (handled via class) — no JS needed.
  useEffect(() => {
    // no-op; class drives transition
  }, [visible]);

  return (
    <div
      ref={wrapRef}
      className={`${s.wrap} ${visible ? s.visible : ""}`}
      aria-hidden={!visible}
    >
      <p ref={helperRef} className={s.helper}>
        About Jihyeon
      </p>

      {islands.map((island) => (
        // Visual island hotspot is offset by px to avoid GSAP transform overrides.
        <button
          key={island.key}
          type="button"
          className={s.hotspot}
          data-key={island.key}
          style={
            island.key === "visual"
              ? {
                  left: `calc(${island.pos.x}% - 80px)`,
                  top: `calc(${island.pos.y}% + 100px)`,
                }
              : { left: `${island.pos.x}%`, top: `${island.pos.y}%` }
          }
          onClick={() => onSelect(island.key)}
          aria-label={`Open ${island.title} — ${island.tag}`}
        >
          <span className={s.dot} aria-hidden="true" />
          <span className={`${s.ring}`} aria-hidden="true" />
          <span className={`${s.ring} ${s.ring2}`} aria-hidden="true" />
          <span className={`${s.ring} ${s.ring3}`} aria-hidden="true" />

          <span className={s.labelAlways}>{island.tag}</span>
          <span className={s.label} aria-hidden="true">
            <span className={s.tagBig}>{island.title}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

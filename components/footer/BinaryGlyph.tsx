"use client";

import { useId, useMemo } from "react";
import type { BinaryMark } from "./binaryMarks";

/* ─────────────────────────────────────────────────────────────────────────
   BinaryGlyph
   Renders a silhouette filled with a deterministic field of 0/1 digits,
   clipped to the mark's shape. The same seed always produces the same
   pattern, so a stamped footprint stays stable across re-renders.

   `inkProgress` (0..1) drives a bottom-up reveal so the press-and-hold
   stamp visibly "inks" the footprint as the visitor holds.
   ───────────────────────────────────────────────────────────────────────── */

function hash32(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

type Cell = {
  x: number;
  y: number;
  char: "0" | "1";
  opacity: number;
};

type Density = "thumb" | "full";

export function BinaryGlyph({
  mark,
  seed,
  size = 120,
  density = "full",
  inkProgress = 1,
  className,
  title,
}: {
  mark: BinaryMark;
  /** Stable seed; same seed → same digit pattern. */
  seed?: string | number;
  size?: number;
  density?: Density;
  inkProgress?: number;
  className?: string;
  title?: string;
}) {
  const { w: vbW, h: vbH } = mark.viewBox;
  const seedNum = useMemo(
    () => (typeof seed === "number" ? seed : hash32(`${mark.id}:${seed ?? ""}`)),
    [seed, mark.id],
  );

  const { cells, fontSize, strays } = useMemo(() => {
    const rng = seededRng(seedNum);
    const cell = density === "thumb" ? vbW / 11 : vbW / 22;
    const cols = Math.ceil(vbW / cell) + 1;
    const rows = Math.ceil(vbH / cell) + 1;
    const fs = cell * 0.82;
    const jit = cell * 0.16;

    const items: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const char: "0" | "1" = rng() > 0.5 ? "1" : "0";
        const opacity = 0.68 + rng() * 0.32;
        items.push({
          x: c * cell + cell / 2 + (rng() - 0.5) * jit,
          y: r * cell + cell / 2 + (rng() - 0.5) * jit,
          char,
          opacity,
        });
      }
    }

    // A few stray digits floating just above the shape — the "scattered"
    // hand-rendered feel from the reference. Only on full density.
    const strayItems: Cell[] =
      density === "full"
        ? Array.from({ length: 5 }, () => ({
            x: vbW * (0.2 + rng() * 0.6),
            y: vbH * (0.02 + rng() * 0.1),
            char: (rng() > 0.5 ? "1" : "0") as "0" | "1",
            opacity: 0.28 + rng() * 0.22,
          }))
        : [];

    return { cells: items, fontSize: fs, strays: strayItems };
  }, [seedNum, density, vbW, vbH]);

  const clipId = useId().replace(/:/g, "");
  const ink = Math.max(0, Math.min(1, inkProgress));
  // Bottom-up reveal line in viewBox units. ink=0 → line at bottom (nothing
  // visible); ink=1 → line at top (all visible). Soft band so the edge fades.
  const revealLine = vbH * (1 - ink);
  const soft = Math.max(vbH * 0.08, 12);

  const revealFactor = (y: number) => {
    if (ink >= 1) return 1;
    if (ink <= 0) return 0;
    if (y >= revealLine + soft) return 1;
    if (y <= revealLine) return 0;
    return (y - revealLine) / soft;
  };

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={size}
      height={(size * vbH) / vbW}
      role="img"
      aria-label={title ?? mark.label}
      className={className}
    >
      <defs>
        <clipPath id={`bg-${clipId}`}>
          <path d={mark.path} />
        </clipPath>
      </defs>

      {/* Stray digits float outside the silhouette, so they live in their own
          un-clipped group. */}
      {strays.length > 0 && ink > 0.55 ? (
        <g
          fontFamily="'IBM Plex Mono', ui-monospace, monospace"
          fontSize={fontSize * 0.9}
          fontWeight={400}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
        >
          {strays.map((s, i) => (
            <text key={`s${i}`} x={s.x} y={s.y} opacity={s.opacity * ink}>
              {s.char}
            </text>
          ))}
        </g>
      ) : null}

      <g
        clipPath={`url(#bg-${clipId})`}
        fontFamily="'IBM Plex Mono', ui-monospace, monospace"
        fontSize={fontSize}
        fontWeight={400}
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
      >
        {cells.map((cell, i) => {
          const op = cell.opacity * revealFactor(cell.y);
          if (op <= 0.01) return null;
          return (
            <text key={i} x={cell.x} y={cell.y} opacity={op}>
              {cell.char}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Category = "driving" | "environment" | "system" | "experience";
type Priority = "high" | "medium" | "low" | null;

type SurfaceZone = {
  id: string;
  label: string;
  /** Position as % of component dimensions */
  top: number;
  left: number;
  width: number;
  height: number;
  /** Sub-zones for split display (HUD inner columns) */
  subZones?: { id: string; label: string; flex: number }[];
};

/** Wireframe boxes from Figma 1153:1871 (% of slide dimensions) */
const ZONES: SurfaceZone[] = [
  {
    id: "hud-outer",
    label: "HUD",
    top: 5,
    left: 7,
    width: 86,
    height: 38,
  },
  {
    id: "hud-inner",
    label: "HUD Information Layer",
    top: 28,
    left: 10.5,
    width: 79,
    height: 14,
    subZones: [
      { id: "cluster", label: "Cluster", flex: 1 },
      { id: "infotainment", label: "Infotainment", flex: 1 },
      { id: "auxiliary", label: "Auxiliary Information", flex: 1 },
    ],
  },
  {
    id: "interior-l",
    label: "Interior Display",
    top: 49,
    left: 7,
    width: 36,
    height: 12,
  },
  {
    id: "steering",
    label: "Steering wheel display",
    top: 58,
    left: 8.5,
    width: 20,
    height: 11,
  },
  {
    id: "interior-r",
    label: "Interior Display",
    top: 49,
    left: 57,
    width: 36,
    height: 12,
  },
  {
    id: "control",
    label: "Control Display",
    top: 51,
    left: 41,
    width: 18,
    height: 24,
  },
];

/** Priority by zone and category (from Figma 1153:1888) */
const PRIORITIES: Record<string, Record<Category, Priority>> = {
  "hud-outer": {
    driving: "high",
    environment: "high",
    system: "medium",
    experience: "low",
  },
  "hud-inner": {
    driving: "high",
    environment: "high",
    system: "high",
    experience: "medium",
  },
  cluster: {
    driving: "high",
    environment: "high",
    system: null,
    experience: null,
  },
  infotainment: {
    driving: null,
    environment: null,
    system: "high",
    experience: "medium",
  },
  auxiliary: {
    driving: null,
    environment: "medium",
    system: "medium",
    experience: "low",
  },
  "interior-l": {
    driving: "high",
    environment: "high",
    system: null,
    experience: null,
  },
  steering: {
    driving: "high",
    environment: null,
    system: null,
    experience: null,
  },
  "interior-r": {
    driving: "low",
    environment: "medium",
    system: "medium",
    experience: "high",
  },
  control: {
    driving: null,
    environment: null,
    system: "high",
    experience: "medium",
  },
};

const PRIORITY_STYLE: Record<
  NonNullable<Priority>,
  { dot: string; label: string; glow?: string }
> = {
  high: {
    dot: "#ff6b4a",
    label: "High",
    glow: "0 0 8px rgba(255,107,74,0.7)",
  },
  medium: { dot: "#f59e0b", label: "Med" },
  low: { dot: "rgba(245,245,245,0.35)", label: "Low" },
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "driving", label: "Driving" },
  { id: "environment", label: "Environment" },
  { id: "system", label: "System" },
  { id: "experience", label: "Experience" },
];

export function IAPriorityMatrix() {
  const [active, setActive] = useState<Category | null>(null);

  return (
    <div className="not-prose">
      <div className="overflow-hidden rounded-2xl">
        {/* Main visual: car interior + wireframe overlay */}
        <div
          className="relative w-full"
          style={{ aspectRatio: "16/9", minHeight: 260 }}
        >
          {/* Background photo */}
          <Image
            src="/images/aeon/hud/road-interior.png"
            alt="AEON cabin interior"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 70vw, 100vw"
            priority
          />

          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)" }}
          />

          {/* Wireframe zones */}
          {ZONES.map((zone) => (
            <WireframeBox
              key={zone.id}
              zone={zone}
              active={active}
            />
          ))}
        </div>

        {/* Category chips */}
        <div
          className="flex flex-wrap items-center gap-2 border-t px-5 py-4"
          style={{
            borderColor: "rgba(245,245,245,0.08)",
            background: "rgba(10,10,10,0.95)",
          }}
        >
          <p
            className="mr-2 shrink-0 text-[10px] font-medium tracking-[0.16em] uppercase"
            style={{ color: "rgba(245,245,245,0.35)" }}
          >
            Info layer
          </p>

          <button
            type="button"
            onClick={() => setActive(null)}
            className="rounded-full px-3 py-1 text-[11px] font-medium transition-all"
            style={{
              background:
                active === null
                  ? "rgba(245,245,245,0.12)"
                  : "rgba(245,245,245,0.04)",
              border: `1px solid ${active === null ? "rgba(245,245,245,0.3)" : "rgba(245,245,245,0.08)"}`,
              color:
                active === null
                  ? "rgba(245,245,245,0.9)"
                  : "rgba(245,245,245,0.45)",
            }}
          >
            All surfaces
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className="rounded-full px-3 py-1 text-[11px] font-medium transition-all"
              style={{
                background:
                  active === c.id
                    ? "rgba(255,107,74,0.15)"
                    : "rgba(245,245,245,0.04)",
                border: `1px solid ${active === c.id ? "rgba(255,107,74,0.5)" : "rgba(245,245,245,0.08)"}`,
                color:
                  active === c.id
                    ? "rgba(255,107,74,0.95)"
                    : "rgba(245,245,245,0.55)",
              }}
            >
              {c.label}
            </button>
          ))}

          {/* Legend */}
          <div className="ml-auto flex items-center gap-4">
            {(["high", "medium", "low"] as NonNullable<Priority>[]).map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{
                    background: PRIORITY_STYLE[p].dot,
                    boxShadow: PRIORITY_STYLE[p].glow,
                  }}
                />
                <span
                  className="text-[10px] tracking-wide"
                  style={{ color: "rgba(245,245,245,0.4)" }}
                >
                  {PRIORITY_STYLE[p].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WireframeBox({
  zone,
  active,
}: {
  zone: SurfaceZone;
  active: Category | null;
}) {
  const priority = active ? PRIORITIES[zone.id]?.[active] : null;
  const showSubZones = active !== null && zone.subZones;

  return (
    <div
      className="absolute"
      style={{
        top: `${zone.top}%`,
        left: `${zone.left}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
        border: "1px solid rgba(245,245,245,0.20)",
        borderRadius: 2,
        pointerEvents: "none",
      }}
    >
      {/* Sub-zone columns for HUD inner */}
      <AnimatePresence>
        {showSubZones && zone.subZones ? (
          <motion.div
            key="subzones"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex"
          >
            {zone.subZones.map((sub, i) => {
              const subPriority = active ? PRIORITIES[sub.id]?.[active] : null;
              return (
                <div
                  key={sub.id}
                  className="relative flex h-full flex-1 flex-col items-center justify-center"
                  style={{
                    borderLeft: i > 0 ? "1px solid rgba(245,245,245,0.15)" : undefined,
                  }}
                >
                  <p
                    className="text-center"
                    style={{
                      fontSize: "clamp(5px, 0.9vw, 9px)",
                      color: "rgba(245,245,245,0.5)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {sub.label}
                  </p>
                  {subPriority ? (
                    <PriorityBadge priority={subPriority} />
                  ) : null}
                </div>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Default label (when no subzones shown) */}
      {!showSubZones && (
        <p
          className="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap text-center"
          style={{
            fontSize: "clamp(5px, 0.85vw, 8.5px)",
            color: "rgba(245,245,245,0.45)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {zone.label}
        </p>
      )}

      {/* Priority badge on the zone itself (when active but no subzones) */}
      <AnimatePresence>
        {active && !zone.subZones && priority ? (
          <motion.div
            key={`${zone.id}-${active}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute bottom-1 right-1"
          >
            <PriorityBadge priority={priority} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: NonNullable<Priority> }) {
  const style = PRIORITY_STYLE[priority];
  return (
    <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ background: "rgba(0,0,0,0.65)" }}>
      <span
        className="block h-1.5 w-1.5 rounded-full shrink-0"
        style={{ background: style.dot, boxShadow: style.glow }}
      />
      <span
        style={{
          fontSize: "clamp(5px, 0.75vw, 8px)",
          color: "rgba(245,245,245,0.8)",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        {style.label}
      </span>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

type Zone = {
  id: string;
  label: string;
  location: string;
  color: string;
  points: { x: number; y: number }[];
};

const ZONES: Zone[] = [
  {
    id: "weather",
    label: "Weather & Environment",
    location: "Upper panoramic display",
    color: "#ff2b79",
    points: [{ x: 50, y: 40.6 }],
  },
  {
    id: "media",
    label: "Media & Entertainment",
    location: "Center display",
    color: "#21e34f",
    points: [{ x: 50, y: 50.2 }],
  },
  {
    id: "navigation",
    label: "Navigation & Route Guidance",
    location: "Forward side displays",
    color: "#3048ff",
    points: [
      { x: 40.2, y: 46.1 },
      { x: 59.8, y: 46.1 },
    ],
  },
  {
    id: "auxiliary",
    label: "Auxiliary Information",
    location: "Peripheral displays",
    color: "#f1e326",
    points: [
      { x: 34.6, y: 49.7 },
      { x: 65.4, y: 49.7 },
    ],
  },
  {
    id: "vehicle",
    label: "Vehicle Settings",
    location: "Lower console",
    color: "#25d8e8",
    points: [{ x: 50, y: 56.4 }],
  },
  {
    id: "climate",
    label: "Climate Control",
    location: "Quick-access control",
    color: "#ff7c1a",
    points: [{ x: 50, y: 53.1 }],
  },
];

export function AeonHmiInformationMap() {
  const [activeZone, setActiveZone] = useState(ZONES[0].id);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveZone((currentZone) => {
        const currentIndex = ZONES.findIndex(
          (zone) => zone.id === currentZone,
        );
        return ZONES[(currentIndex + 1) % ZONES.length].id;
      });
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeZone]);

  return (
    <section
      className="not-prose grid overflow-hidden border border-white/15 lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.88fr)]"
      aria-label="HMI information zone mapping"
    >
      <figure className="m-0 min-w-0 border-b border-white/15 lg:border-b-0 lg:border-r">
        <div className="flex min-h-12 items-center border-b border-white/15 px-4 t-eyebrow-mut">
          <span>HMI INFORMATION ARCHITECTURE</span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f3]">
          <Image
            src="/images/aeon/ia/hmi_sketch.jpeg"
            alt="Hand-drawn cockpit sketch with six color-coded information zones"
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {ZONES.flatMap((zone, zoneIndex) =>
              zone.points.map((point, pointIndex) => {
                const isActive = activeZone === zone.id;

                return (
                  <span
                    key={`${zone.id}-${pointIndex}`}
                    className={[
                      "absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-black/50 bg-white/90 text-[8px] font-semibold text-black transition-[opacity,transform,box-shadow] duration-500 ease-in-out",
                      isActive ? "scale-100 opacity-100" : "scale-75 opacity-0",
                    ].join(" ")}
                    style={
                      {
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        boxShadow: isActive
                          ? `0 0 0 5px ${zone.color}45, 0 0 22px ${zone.color}99`
                          : "none",
                      } as CSSProperties
                    }
                  >
                    {String(zoneIndex + 1).padStart(2, "0")}
                  </span>
                );
              }),
            )}
          </div>
        </div>

        <figcaption className="flex min-h-16 items-center border-t border-white/15 px-4 py-3 t-caption">
          Color-coded map of the six information categories assigned to each
          display
        </figcaption>
      </figure>

      <div className="flex min-w-0 flex-col">
        <div className="flex min-h-12 items-center border-b border-white/15 px-4 t-eyebrow-mut">
          <span>Information zones</span>
        </div>

        <div className="grid flex-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-6">
          {ZONES.map((zone, index) => {
            const isActive = activeZone === zone.id;

            return (
              <button
                key={zone.id}
                type="button"
                className={[
                  "relative grid min-h-20 w-full grid-cols-[2rem_1fr_auto] items-center gap-2 border-b border-white/15 px-4 py-3 text-left transition-colors duration-500 ease-in-out focus-visible:outline-none sm:odd:border-r lg:odd:border-r-0",
                  isActive
                    ? "bg-white/[0.05] text-ink"
                    : "bg-transparent text-muted hover:bg-white/[0.035] hover:text-ink",
                ].join(" ")}
                onMouseEnter={() => setActiveZone(zone.id)}
                onFocus={() => setActiveZone(zone.id)}
                onClick={() => setActiveZone(zone.id)}
                aria-pressed={isActive}
              >
                <span
                  className={[
                    "absolute inset-y-0 left-0 w-0.5 origin-center transition-transform duration-500 ease-in-out",
                    isActive ? "scale-y-100" : "scale-y-0",
                  ].join(" ")}
                  style={{ backgroundColor: zone.color }}
                  aria-hidden="true"
                />
                <span className="self-start pt-0.5 text-[9px] tracking-[0.08em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <strong className="block text-sm font-normal leading-tight">
                    {zone.label}
                  </strong>
                  <small className="mt-1.5 block text-[10px] text-muted">
                    {zone.location}
                  </small>
                </span>
                <span
                  className="h-3.5 w-3.5 rounded-full border border-white/40"
                  style={{
                    backgroundColor: zone.color,
                    boxShadow: `0 0 13px ${zone.color}73`,
                  }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

const INK = "#171717";
const ACCENT = "#FD8C37";

const points: [number, number][] = [
  [6, 0.18],
  [7, 0.32],
  [8, 0.55],
  [9, 0.74],
  [10, 0.82],
  [11, 0.78],
  [12, 0.66],
  [13, 0.5],
  [14, 0.42],
  [15, 0.5],
  [16, 0.62],
  [17, 0.7],
  [18, 0.74],
  [19, 0.68],
  [20, 0.55],
  [21, 0.4],
  [22, 0.28],
  [23, 0.18],
];

function taskTypeFor(value: number): string {
  if (value >= 0.7) return "Deep work";
  if (value >= 0.5) return "Focused work";
  if (value >= 0.35) return "Light admin";
  return "Recovery";
}

function valueAt(hr: number): number {
  if (hr <= points[0][0]) return points[0][1];
  if (hr >= points[points.length - 1][0]) return points[points.length - 1][1];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (hr >= x1 && hr <= x2) {
      const t = (hr - x1) / (x2 - x1);
      return y1 + (y2 - y1) * t;
    }
  }
  return 0.5;
}

export function EnergyRhythmInteractive() {
  const w = 600;
  const h = 280;
  const pad = { l: 56, r: 32, t: 36, b: 50 };
  const x = (hr: number) =>
    pad.l + ((hr - 6) / (23 - 6)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v) * (h - pad.t - pad.b);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p[0])} ${y(p[1])}`)
    .join(" ");

  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ hr: number; v: number } | null>(null);
  const [flatHover, setFlatHover] = useState(false);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    if (px < pad.l || px > w - pad.r) {
      setHover(null);
      return;
    }
    const hr = 6 + ((px - pad.l) / (w - pad.l - pad.r)) * (23 - 6);
    const clamped = Math.max(6, Math.min(23, hr));
    setHover({ hr: clamped, v: valueAt(clamped) });
  };

  const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full cursor-crosshair"
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      {/* horizontal grid */}
      {[0.25, 0.5, 0.75].map((v) => (
        <line
          key={v}
          x1={pad.l}
          x2={w - pad.r}
          y1={y(v)}
          y2={y(v)}
          stroke={INK}
          strokeOpacity="0.08"
          strokeDasharray="2 4"
        />
      ))}

      {/* "planner assumes flat energy" reference */}
      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={y(0.7)}
        y2={y(0.7)}
        stroke={flatHover ? ACCENT : INK}
        strokeOpacity={flatHover ? 0.6 : 0.22}
        strokeDasharray="3 3"
        style={{ transition: "all 0.2s ease" }}
      />
      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={y(0.7)}
        y2={y(0.7)}
        stroke="transparent"
        strokeWidth="14"
        onMouseEnter={() => setFlatHover(true)}
        onMouseLeave={() => setFlatHover(false)}
        style={{ cursor: "help" }}
      />
      <text
        x={w - pad.r}
        y={y(0.7) - 6}
        textAnchor="end"
        fontFamily="inherit"
        fontSize="10"
        fill={INK}
        fillOpacity={flatHover ? 0.85 : 0.5}
        style={{ letterSpacing: "0.16em", transition: "fill-opacity 0.2s ease" }}
      >
        {flatHover ? "← REAL ENERGY ISN'T FLAT" : "PLANNER ASSUMES FLAT ENERGY"}
      </text>

      {/* Midday dip annotation */}
      <line
        x1={x(14)}
        x2={x(14)}
        y1={pad.t}
        y2={h - pad.b}
        stroke={ACCENT}
        strokeOpacity="0.45"
        strokeDasharray="2 3"
      />
      <text
        x={x(14)}
        y={pad.t - 8}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="10"
        fill={ACCENT}
        style={{ letterSpacing: "0.18em" }}
      >
        MIDDAY DIP
      </text>

      {/* Evening recovery */}
      <line
        x1={x(18)}
        x2={x(18)}
        y1={pad.t}
        y2={h - pad.b}
        stroke={INK}
        strokeOpacity="0.25"
        strokeDasharray="2 3"
      />
      <text
        x={x(18)}
        y={pad.t - 8}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="10"
        fill={INK}
        fillOpacity="0.55"
        style={{ letterSpacing: "0.18em" }}
      >
        EVENING RECOVERY
      </text>

      {/* curve */}
      <path
        d={path}
        fill="none"
        stroke={INK}
        strokeOpacity="0.85"
        strokeWidth="1.5"
      />

      {/* Pulsing dip point */}
      <motion.circle
        cx={x(14)}
        cy={y(0.42)}
        r={3.5}
        fill={ACCENT}
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.95, 0.4, 0.95],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: `${x(14)}px ${y(0.42)}px` }}
      />

      {/* Hover guide */}
      {hover && (
        <g>
          <line
            x1={x(hover.hr)}
            x2={x(hover.hr)}
            y1={pad.t}
            y2={h - pad.b}
            stroke={ACCENT}
            strokeOpacity="0.55"
          />
          <circle
            cx={x(hover.hr)}
            cy={y(hover.v)}
            r="4"
            fill="#fff"
            stroke={ACCENT}
            strokeWidth="1.5"
          />
          {/* Tooltip */}
          <g
            transform={`translate(${
              x(hover.hr) > w / 2 ? x(hover.hr) - 152 : x(hover.hr) + 12
            }, ${y(hover.v) - 32})`}
          >
            <rect
              x={0}
              y={0}
              width={140}
              height={44}
              rx="6"
              fill="#171717"
              fillOpacity="0.92"
            />
            <text
              x={10}
              y={16}
              fontFamily="inherit"
              fontSize="10"
              fill="#fff"
              fillOpacity="0.55"
              style={{ letterSpacing: "0.18em" }}
            >
              {formatHour(hover.hr)} · {Math.round(hover.v * 100)}% ENERGY
            </text>
            <text
              x={10}
              y={32}
              fontFamily="inherit"
              fontSize="12"
              fill="#fff"
              fontWeight="400"
            >
              {taskTypeFor(hover.v)}
            </text>
          </g>
        </g>
      )}

      {/* x-axis labels */}
      <g
        fontFamily="inherit"
        fontSize="10"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.16em" }}
        textAnchor="middle"
      >
        {hours.map((hr) => {
          const label =
            hr === 12 ? "12P" : hr > 12 ? `${hr - 12}P` : `${hr}A`;
          return (
            <text key={hr} x={x(hr)} y={h - pad.b + 18}>
              {label}
            </text>
          );
        })}
      </g>

      {/* y-axis labels */}
      <g
        fontFamily="inherit"
        fontSize="10"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.16em" }}
        textAnchor="end"
      >
        <text x={pad.l - 10} y={y(0.95)}>
          HIGH
        </text>
        <text x={pad.l - 10} y={y(0.5) + 3}>
          MID
        </text>
        <text x={pad.l - 10} y={y(0.05)}>
          LOW
        </text>
      </g>

      {/* axes */}
      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={h - pad.b}
        y2={h - pad.b}
        stroke={INK}
        strokeOpacity="0.25"
      />
      <line
        x1={pad.l}
        x2={pad.l}
        y1={pad.t}
        y2={h - pad.b}
        stroke={INK}
        strokeOpacity="0.25"
      />
    </svg>
  );
}

function formatHour(hr: number): string {
  const h = Math.round(hr);
  if (h === 12) return "12 PM";
  if (h === 24 || h === 0) return "12 AM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

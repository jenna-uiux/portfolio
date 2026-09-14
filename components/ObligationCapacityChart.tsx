"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INK = "#171717";
const ENERGY_ACCENT = "#FD8C37";
const TOTAL_ROWS = 16;
const DOT_COLUMN_COUNT = 86;

const COLUMNS = [
  {
    x: 0,
    width: 160,
    period: "Morning",
    title: "Plan created",
    lines: ["“Finish my portfolio", "case study tonight.”"],
    accent: false,
    dark: false,
  },
  {
    x: 170,
    width: 440,
    period: "Work and school",
    title: "External obligations",
    lines: [
      "Meetings, deadlines, class, and assignments",
      "consume attention first.",
    ],
    accent: false,
    dark: true,
  },
  {
    x: 620,
    width: 200,
    period: "Evening",
    title: "Same task, less capacity",
    lines: ["The user still has to break it", "down and choose where to start."],
    accent: true,
    dark: false,
  },
  {
    x: 830,
    width: 170,
    period: "Tomorrow",
    title: "Postponed",
    lines: ["“It is not urgent. I will", "do it tomorrow.”"],
    accent: false,
    dark: false,
  },
];

const ENERGY_END_X = 820;
const ENERGY_SPAN = ENERGY_END_X - 4;

const ENERGY_DOTS = Array.from({ length: DOT_COLUMN_COUNT }, (_, columnIndex) => {
  const progress = columnIndex / (DOT_COLUMN_COUNT - 1);
  const x = 4 + progress * ENERGY_SPAN;
  const morningEnd = 0.2;
  const workEnd = 0.74;
  const smooth = (value: number) => value * value * (3 - 2 * value);
  const energyLevel =
    progress <= morningEnd
      ? 1 - (progress / morningEnd) * 0.04
      : progress <= workEnd
        ? 0.96 -
          smooth((progress - morningEnd) / (workEnd - morningEnd)) * 0.74
        : Math.max(
            0.08,
            0.22 - smooth((progress - workEnd) / (1 - workEnd)) * 0.14
          );
  const baseCount = Math.max(1, Math.round(TOTAL_ROWS * energyLevel));
  const count =
    progress <= morningEnd
      ? baseCount
      : progress <= workEnd
        ? Math.max(3, Math.round(baseCount * 0.82))
        : Math.max(2, Math.round(baseCount * 0.75));
  const baselineY = 145 + Math.sin(progress * Math.PI * 2) * 1.2;
  const spread = 4 + energyLevel * 126;
  const centerY = baselineY - spread / 2;

  return Array.from({ length: count }, (_, dotIndex) => {
    const offset =
      count === 1
        ? 0
        : (dotIndex / (count - 1) - 0.5) * spread;

    return {
      key: `${columnIndex}-${dotIndex}`,
      x,
      y:
        centerY +
        offset +
        Math.sin(columnIndex * 1.7 + dotIndex * 2.3) * 0.5,
      radius: 1.05 + ((columnIndex + dotIndex * 2) % 4) * 0.2,
      opacity: 0.95 - progress * 0.28,
      progress,
      columnIndex,
    };
  });
}).flat();

const DOT_COLUMNS = Array.from({ length: DOT_COLUMN_COUNT }, (_, columnIndex) =>
  ENERGY_DOTS.filter((dot) => dot.columnIndex === columnIndex)
);

// The plan carries into Tomorrow drained of energy: same dot language, no color.
const POSTPONED_DOTS = Array.from({ length: 15 }, (_, columnIndex) => {
  const x = 848 + columnIndex * 9.6;
  const spread = 13;
  const centerY = 138;

  return Array.from({ length: 2 }, (_, dotIndex) => ({
    key: `p-${columnIndex}-${dotIndex}`,
    x,
    y:
      centerY +
      (dotIndex - 0.5) * spread +
      Math.sin(columnIndex * 1.7 + dotIndex * 2.3) * 0.5,
    radius: 1.05 + ((columnIndex + dotIndex * 2) % 4) * 0.2,
    opacity: 0.34 - columnIndex * 0.008,
  }));
}).flat();

export function ObligationCapacityChart() {
  const root = useRef<HTMLDivElement>(null);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const activeStage = hoveredStage ?? selectedStage;

  const stageForX = (x: number) => {
    if (x < 170) return 0;
    if (x < 620) return 1;
    if (x < 830) return 2;
    return 3;
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 1000;
    setHoveredStage(stageForX(x));
  };

  useGSAP(
    () => {
      const element = root.current;
      if (!element) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const dots = gsap.utils.toArray<SVGCircleElement>(
        "[data-energy-dot]",
        element
      );
      const stages = gsap.utils.toArray<SVGGElement>("[data-stage]", element);
      const axis = gsap.utils.toArray<SVGGElement>(
        "[data-energy-axis]",
        element
      );
      const driftColumns = gsap.utils.toArray<SVGGElement>(
        "[data-drift-column]",
        element
      );
      const eveningRule =
        element.querySelector<SVGLineElement>("[data-evening-rule]");
      const postponedDots = gsap.utils.toArray<SVGCircleElement>(
        "[data-postponed-dot]",
        element
      );

      if (reducedMotion) {
        gsap.set(
          [...dots, ...stages, ...axis, ...postponedDots, eveningRule],
          {
            clearProps: "all",
          }
        );
        return;
      }

      gsap.set(dots, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: "center center",
      });
      gsap.set(stages, { autoAlpha: 0, y: 20 });
      gsap.set(axis, { autoAlpha: 0 });
      gsap.set(eveningRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(postponedDots, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: "center center",
      });

      const wave = gsap.timeline({
        paused: true,
        repeat: -1,
      });

      driftColumns.forEach((column, index) => {
        const start = index * 0.02;

        wave
          .to(
            column,
            {
              y: -6,
              duration: 0.55,
              ease: "sine.inOut",
            },
            start
          )
          .to(
            column,
            {
              y: 4,
              duration: 0.6,
              ease: "sine.inOut",
            },
            start + 0.45
          )
          .to(
            column,
            {
              y: 0,
              duration: 0.55,
              ease: "sine.inOut",
            },
            start + 0.9
          );
      });
      let introComplete = false;

      const playWave = () => wave.play();
      const pauseWave = () => wave.pause();

      const intro = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: element,
          start: "top 78%",
          once: true,
        },
        onComplete: () => {
          introComplete = true;
          playWave();
        },
      });

      intro
        .to(axis, { autoAlpha: 1, duration: 0.45 }, 0)
        .to(
          stages,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          0
        )
        .to(
          dots,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.38,
            stagger: (_index, target) => {
              const progress = Number(
                (target as SVGCircleElement).dataset.progress ?? 0
              );
              return progress * 0.9;
            },
          },
          0
        )
        .to(
          eveningRule,
          {
            scaleX: 1,
            duration: 0.45,
            ease: "power2.inOut",
          },
          0.2
        )
        .to(
          postponedDots,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.38,
            stagger: 0.015,
          },
          0.9
        );

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          if (introComplete) playWave();
        },
        onEnterBack: () => {
          if (introComplete) playWave();
        },
        onLeave: pauseWave,
        onLeaveBack: pauseWave,
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="h-full w-full min-w-0 overflow-hidden">
      <div className="mb-3 flex items-center justify-between gap-4 text-[11px] font-light text-ink/50">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[color:var(--accent-orange)]" />
            User&apos;s energy capacity
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-ink/25" />
            Postponed plan
          </span>
        </div>
        <span className="hidden sm:inline">Hover or tap a moment</span>
      </div>
      <svg
        viewBox="0 0 1000 350"
        className="h-full w-full touch-pan-y"
        preserveAspectRatio="xMidYMid meet"
        overflow="hidden"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredStage(null)}
      >
      {activeStage !== null ? (
        <g aria-hidden="true" className="pointer-events-none">
          <line
            x1={COLUMNS[activeStage].x + COLUMNS[activeStage].width / 2}
            x2={COLUMNS[activeStage].x + COLUMNS[activeStage].width / 2}
            y1="18"
            y2="332"
            stroke={activeStage === 3 ? INK : ENERGY_ACCENT}
            strokeOpacity="0.18"
            strokeDasharray="2 6"
          />
          <circle
            cx={COLUMNS[activeStage].x + COLUMNS[activeStage].width / 2}
            cy="18"
            r="3"
            fill={activeStage === 3 ? INK : ENERGY_ACCENT}
          />
        </g>
      ) : null}
      <g aria-label="Energy decreases as external obligations consume attention">
        {DOT_COLUMNS.map((dots, columnIndex) => (
          <g key={columnIndex} data-drift-column>
            {dots.map((dot) => (
              <circle
                key={dot.key}
                data-energy-dot
                data-progress={dot.progress}
                cx={dot.x}
                cy={dot.y}
                r={dot.radius}
                fill={ENERGY_ACCENT}
                fillOpacity={
                  activeStage === null || stageForX(dot.x) === activeStage
                    ? dot.opacity
                    : 0.1
                }
                style={{ transition: "fill-opacity 240ms ease" }}
              />
            ))}
          </g>
        ))}
      </g>

      <g aria-label="The unfinished plan carries into tomorrow without energy">
        {POSTPONED_DOTS.map((dot) => (
          <circle
            key={dot.key}
            data-postponed-dot
            cx={dot.x}
            cy={dot.y}
            r={dot.radius}
            fill={INK}
            fillOpacity={
              activeStage === null || activeStage === 3 ? dot.opacity : 0.08
            }
            style={{ transition: "fill-opacity 240ms ease" }}
          />
        ))}
      </g>

      {COLUMNS.map((column, stageIndex) => {
        const isActive = activeStage === stageIndex;
        const isDimmed = activeStage !== null && !isActive;

        return (
        <g
          key={column.period}
          data-stage
          role="button"
          tabIndex={0}
          aria-label={`${column.period}: ${column.title}. ${column.lines.join(" ")}`}
          aria-pressed={selectedStage === stageIndex}
          className="cursor-pointer outline-none"
          onPointerEnter={() => setHoveredStage(stageIndex)}
          onPointerLeave={() => setHoveredStage(null)}
          onFocus={() => setHoveredStage(stageIndex)}
          onBlur={() => setHoveredStage(null)}
          onClick={() =>
            setSelectedStage((current) =>
              current === stageIndex ? null : stageIndex
            )
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedStage((current) =>
                current === stageIndex ? null : stageIndex
              );
            }
          }}
        >
          <g
            opacity={isDimmed ? 0.32 : 1}
            style={{ transition: "opacity 240ms ease" }}
          >
          <text
            x={column.x + 6}
            y="199"
            fontFamily="inherit"
            fontSize="11"
            fill={INK}
            fillOpacity={isActive ? 0.75 : 0.48}
          >
            {column.period}
          </text>
          <line
            data-evening-rule={column.accent ? true : undefined}
            x1={column.x}
            x2={column.x + column.width}
            y1="214"
            y2="214"
            stroke={isActive || column.accent ? ENERGY_ACCENT : INK}
            strokeOpacity={isActive ? 1 : column.accent || column.dark ? 0.65 : 0.14}
            strokeWidth={isActive ? 3 : column.accent || column.dark ? 2 : 1}
          />
          <text
            x={column.x + 6}
            y="244"
            fontFamily="inherit"
            fontSize="12"
            fontWeight="500"
            fill={isActive ? ENERGY_ACCENT : INK}
          >
            {column.title}
          </text>
          <text
            x={column.x + 6}
            y="273"
            fontFamily="inherit"
            fontSize="12"
            fontWeight="300"
            fill={INK}
            fillOpacity={isActive ? 0.72 : 0.58}
          >
            {column.lines.map((line, index) => (
              <tspan
                key={line}
                x={column.x + 6}
                dy={index === 0 ? 0 : 20}
              >
                {line}
              </tspan>
            ))}
          </text>
          </g>
        </g>
        );
      })}
      </svg>
    </div>
  );
}

import type { ChartId, ImageRatio } from "@/lib/projects";
import { EnergyRhythmInteractive } from "./EnergyRhythmInteractive";

const ratioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-[16/9]",
  "21/9": "aspect-[21/9]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

const TITLES: Record<ChartId, string> = {
  "diary-structure": "Diary study · entry density",
  "energy-rhythm": "Daily energy rhythm",
  "signal-flow": "Signal → inference → plan",
  "elastic-deadline": "Elastic deadline behavior",
  "readiness-mapping": "Signals → readiness states",
  "before-after-entry": "Task entry · before / after",
  "ai-correction-loop": "AI correction loop",
};

type ChartFrameProps = {
  kind: ChartId;
  ratio?: ImageRatio;
  caption?: string;
  children: React.ReactNode;
};

function ChartFrame({
  kind,
  ratio = "16/9",
  caption,
  children,
}: ChartFrameProps) {
  return (
    <figure className="w-full">
      <div
        role="img"
        aria-label={TITLES[kind]}
        className={[
          "relative w-full overflow-hidden rounded-lg bg-white",
          ratioClass[ratio],
        ].join(" ")}
      >
        <div className="absolute inset-0 px-8 py-8">{children}</div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[12px] font-light italic text-ink/55">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const INK = "#171717";
const ACCENT = "#FF8426";

function DiaryStructureChart() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const participants = ["P01", "P02", "P03", "P04", "P05", "P06"];
  // Synthetic but plausible energy logs, 1-5; null = no entry
  const grid: (number | null)[][] = [
    [4, 3, 2, 4, 3, 5, 4],
    [3, 4, 2, 3, 4, null, 3],
    [4, 3, 1, 2, 3, 4, 4],
    [5, 4, 3, 2, 3, 4, 3],
    [3, 2, 2, 3, 4, 5, null],
    [4, 4, 3, 3, 2, 3, 4],
  ];

  const cellW = 56;
  const cellH = 32;
  const gridX = 60;
  const gridY = 40;

  return (
    <svg
      viewBox="0 0 600 280"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.16em" }}
        textAnchor="middle"
      >
        {days.map((d, i) => (
          <text key={d} x={gridX + i * cellW + cellW / 2} y={gridY - 12}>
            {d}
          </text>
        ))}
      </g>

      <g
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.16em" }}
      >
        {participants.map((p, i) => (
          <text
            key={p}
            x={gridX - 14}
            y={gridY + i * cellH + cellH / 2 + 3}
            textAnchor="end"
          >
            {p}
          </text>
        ))}
      </g>

      {grid.map((row, ri) =>
        row.map((v, ci) => {
          const cx = gridX + ci * cellW + cellW / 2;
          const cy = gridY + ri * cellH + cellH / 2;
          if (v === null) {
            return (
              <g key={`${ri}-${ci}`}>
                <line
                  x1={cx - 4}
                  y1={cy}
                  x2={cx + 4}
                  y2={cy}
                  stroke={INK}
                  strokeOpacity="0.18"
                  strokeWidth="0.75"
                />
              </g>
            );
          }
          const r = 2 + v * 1.6;
          const opacity = 0.25 + v * 0.12;
          return (
            <circle
              key={`${ri}-${ci}`}
              cx={cx}
              cy={cy}
              r={r}
              fill={ACCENT}
              fillOpacity={opacity}
            />
          );
        })
      )}

      <g
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.55"
        style={{ letterSpacing: "0.16em" }}
      >
        <text x={gridX} y={250}>
          ENERGY · LOW
        </text>
        <g transform={`translate(${gridX + 100}, 247)`}>
          {[1, 2, 3, 4, 5].map((v, i) => (
            <circle
              key={v}
              cx={i * 18}
              cy={0}
              r={2 + v * 1.6}
              fill={ACCENT}
              fillOpacity={0.25 + v * 0.12}
            />
          ))}
        </g>
        <text x={gridX + 200} y={250}>
          HIGH
        </text>
      </g>
    </svg>
  );
}

function SignalFlowChart() {
  const w = 600;
  const h = 280;
  const colW = w / 3;
  const signals = ["Sleep duration", "Heart rate variability", "Activity level", "Recovery trend"];
  const outputs = ["Task placement", "Elastic windows", "Deferred prompts"];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* column headers */}
      <g
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.18em" }}
      >
        <text x={36} y={20}>
          SIGNALS
        </text>
        <text x={colW + 36} y={20}>
          INFERENCE
        </text>
        <text x={2 * colW + 36} y={20}>
          PLANNING
        </text>
      </g>

      {/* signals column */}
      <g
        fontFamily="inherit"
        fontSize="11"
        fill={INK}
        fillOpacity="0.85"
        fontWeight="300"
      >
        {signals.map((s, i) => {
          const cy = 60 + i * 42;
          return (
            <g key={s}>
              <circle cx={50} cy={cy} r="3" fill={ACCENT} fillOpacity="0.7" />
              <text x={62} y={cy + 4}>
                {s}
              </text>
              <line
                x1={180}
                x2={colW + 30}
                y1={cy}
                y2={h / 2}
                stroke={INK}
                strokeOpacity="0.18"
              />
            </g>
          );
        })}
      </g>

      {/* inference node */}
      <g>
        <rect
          x={colW + 30}
          y={h / 2 - 38}
          width={colW - 60}
          height="76"
          rx="8"
          fill="none"
          stroke={INK}
          strokeOpacity="0.55"
        />
        <text
          x={colW + colW / 2}
          y={h / 2 - 8}
          textAnchor="middle"
          fontFamily="inherit"
          fontSize="11"
          fill={INK}
          fillOpacity="0.85"
          fontWeight="400"
        >
          Readiness model
        </text>
        <text
          x={colW + colW / 2}
          y={h / 2 + 12}
          textAnchor="middle"
          fontFamily="inherit"
          fontSize="9"
          fill={INK}
          fillOpacity="0.55"
          style={{ letterSpacing: "0.18em" }}
        >
          IN FLOW · LIGHT · RECOVERY
        </text>
      </g>

      {/* arrows from inference to planning */}
      <g>
        {outputs.map((o, i) => {
          const cy = 70 + i * 50;
          return (
            <g key={o}>
              <line
                x1={2 * colW - 30}
                x2={2 * colW + 30}
                y1={h / 2}
                y2={cy}
                stroke={INK}
                strokeOpacity="0.22"
              />
              <circle
                cx={2 * colW + 30}
                cy={cy}
                r="3"
                fill={INK}
                fillOpacity="0.7"
              />
              <text
                x={2 * colW + 42}
                y={cy + 4}
                fontFamily="inherit"
                fontSize="11"
                fill={INK}
                fillOpacity="0.85"
                fontWeight="300"
              >
                {o}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ElasticDeadlineChart() {
  const w = 600;
  const h = 280;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dayW = (w - 80) / 7;
  const dayX = (i: number) => 56 + i * dayW;

  type Row = {
    label: string;
    note: string;
    windowStart: number;
    windowEnd: number;
    taskStart: number;
    taskEnd: number;
    locked?: boolean;
  };

  const rows: Row[] = [
    {
      label: "ENERGY DROPS",
      note: "Window stretches · expectation softens",
      windowStart: 1,
      windowEnd: 5,
      taskStart: 2.4,
      taskEnd: 4.6,
    },
    {
      label: "ENERGY IMPROVES",
      note: "Window contracts · opportunity expands earlier",
      windowStart: 1,
      windowEnd: 4,
      taskStart: 1.4,
      taskEnd: 2.6,
    },
    {
      label: "EXTERNAL CONSTRAINT",
      note: "Window locked · system never silently moves the task",
      windowStart: 3,
      windowEnd: 4,
      taskStart: 3.1,
      taskEnd: 3.9,
      locked: true,
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* day grid */}
      <g
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.45"
        style={{ letterSpacing: "0.16em" }}
        textAnchor="middle"
      >
        {days.map((d, i) => (
          <text key={i} x={dayX(i) + dayW / 2} y={20}>
            {d}
          </text>
        ))}
      </g>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={i}
          x1={dayX(0) + i * dayW}
          x2={dayX(0) + i * dayW}
          y1={28}
          y2={h - 24}
          stroke={INK}
          strokeOpacity="0.06"
        />
      ))}

      {rows.map((r, i) => {
        const cy = 60 + i * 70;
        const wxs = dayX(r.windowStart);
        const wxe = dayX(r.windowEnd);
        const txs = dayX(r.taskStart);
        const txe = dayX(r.taskEnd);
        return (
          <g key={r.label}>
            <text
              x={56}
              y={cy - 22}
              fontFamily="inherit"
              fontSize="9"
              fill={INK}
              fillOpacity="0.55"
              style={{ letterSpacing: "0.18em" }}
            >
              {r.label}
            </text>

            {/* readiness window */}
            <rect
              x={wxs}
              y={cy - 12}
              width={wxe - wxs}
              height="24"
              rx="12"
              fill={ACCENT}
              fillOpacity="0.08"
              stroke={ACCENT}
              strokeOpacity="0.25"
              strokeDasharray={r.locked ? "0" : "3 3"}
            />

            {/* task bar */}
            <rect
              x={txs}
              y={cy - 6}
              width={txe - txs}
              height="12"
              rx="6"
              fill={r.locked ? INK : ACCENT}
              fillOpacity={r.locked ? 0.85 : 0.75}
            />

            {/* arrows showing flexibility (or lock icon) */}
            {!r.locked ? (
              <g
                stroke={INK}
                strokeOpacity="0.4"
                strokeWidth="1"
                fill="none"
              >
                <path d={`M ${wxs - 10} ${cy} L ${wxs - 4} ${cy - 4} M ${wxs - 10} ${cy} L ${wxs - 4} ${cy + 4}`} />
                <path d={`M ${wxe + 10} ${cy} L ${wxe + 4} ${cy - 4} M ${wxe + 10} ${cy} L ${wxe + 4} ${cy + 4}`} />
              </g>
            ) : (
              <g>
                <rect
                  x={wxe + 6}
                  y={cy - 6}
                  width="10"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke={INK}
                  strokeOpacity="0.5"
                />
                <path
                  d={`M ${wxe + 8} ${cy - 6} v -3 a 3 3 0 0 1 6 0 v 3`}
                  fill="none"
                  stroke={INK}
                  strokeOpacity="0.5"
                />
              </g>
            )}

            <text
              x={56}
              y={cy + 28}
              fontFamily="inherit"
              fontSize="11"
              fill={INK}
              fillOpacity="0.7"
              fontWeight="300"
            >
              {r.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ReadinessMappingChart() {
  const w = 600;
  const h = 280;
  const states = [
    {
      key: "IN FLOW",
      desc: "Deep, focused work",
      contributions: { sleep: 0.85, hrv: 0.85, activity: 0.6, recovery: 0.7 },
      color: ACCENT,
    },
    {
      key: "LIGHT",
      desc: "Admin, review, communication",
      contributions: { sleep: 0.55, hrv: 0.5, activity: 0.55, recovery: 0.5 },
      color: ACCENT,
    },
    {
      key: "RECOVERY",
      desc: "Rest, reflection, low-effort tasks",
      contributions: { sleep: 0.3, hrv: 0.25, activity: 0.4, recovery: 0.25 },
      color: ACCENT,
    },
  ];

  const signalLabels: { key: keyof (typeof states)[0]["contributions"]; label: string }[] = [
    { key: "sleep", label: "SLEEP" },
    { key: "hrv", label: "HRV" },
    { key: "activity", label: "ACTIVITY" },
    { key: "recovery", label: "RECOVERY" },
  ];

  const colW = (w - 80) / 3;
  const barW = colW - 64;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {states.map((s, i) => {
        const cx = 40 + i * colW;
        return (
          <g key={s.key}>
            <text
              x={cx}
              y={20}
              fontFamily="inherit"
              fontSize="9"
              fill={INK}
              fillOpacity="0.55"
              style={{ letterSpacing: "0.2em" }}
            >
              {s.key}
            </text>
            <text
              x={cx}
              y={36}
              fontFamily="inherit"
              fontSize="11"
              fill={INK}
              fillOpacity="0.85"
              fontWeight="300"
            >
              {s.desc}
            </text>

            {/* state bar pills */}
            {signalLabels.map((sig, j) => {
              const v = s.contributions[sig.key];
              const yy = 70 + j * 36;
              return (
                <g key={sig.key}>
                  <text
                    x={cx}
                    y={yy - 6}
                    fontFamily="inherit"
                    fontSize="9"
                    fill={INK}
                    fillOpacity="0.45"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {sig.label}
                  </text>
                  {/* track */}
                  <rect
                    x={cx}
                    y={yy}
                    width={barW}
                    height="6"
                    rx="3"
                    fill={INK}
                    fillOpacity="0.06"
                  />
                  {/* value */}
                  <rect
                    x={cx}
                    y={yy}
                    width={barW * v}
                    height="6"
                    rx="3"
                    fill={s.color}
                    fillOpacity={0.35 + v * 0.45}
                  />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* divider lines */}
      {[1, 2].map((i) => (
        <line
          key={i}
          x1={40 + i * colW - 16}
          x2={40 + i * colW - 16}
          y1={50}
          y2={h - 30}
          stroke={INK}
          strokeOpacity="0.08"
        />
      ))}
    </svg>
  );
}

function BeforeAfterEntryChart() {
  const w = 600;
  const h = 340;
  const phoneW = 180;
  const phoneH = 280;
  const gap = 70;
  const totalW = phoneW * 2 + gap;
  const startX = (w - totalW) / 2;
  const phoneY = 20;

  const drawPhone = (
    x: number,
    label: string,
    isAfter: boolean
  ) => {
    return (
      <g key={label}>
        <text
          x={x}
          y={phoneY - 4}
          fontFamily="inherit"
          fontSize="9"
          fill={INK}
          fillOpacity="0.5"
          style={{ letterSpacing: "0.2em" }}
        >
          {label}
        </text>

        {/* phone outline */}
        <rect
          x={x}
          y={phoneY}
          width={phoneW}
          height={phoneH}
          rx="22"
          fill="none"
          stroke={INK}
          strokeOpacity="0.5"
        />

        {/* status bar */}
        <line
          x1={x + 16}
          x2={x + phoneW - 16}
          y1={phoneY + 22}
          y2={phoneY + 22}
          stroke={INK}
          strokeOpacity="0.12"
        />

        {/* content rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x={x + 18}
              y={phoneY + 44 + i * 32}
              width={phoneW - 36}
              height="20"
              rx="4"
              fill={INK}
              fillOpacity="0.05"
            />
            <line
              x1={x + 24}
              x2={x + phoneW - 60}
              y1={phoneY + 54 + i * 32}
              y2={phoneY + 54 + i * 32}
              stroke={INK}
              strokeOpacity="0.18"
            />
          </g>
        ))}

        {!isAfter ? (
          <>
            {/* tab bar with buried + */}
            <line
              x1={x + 16}
              x2={x + phoneW - 16}
              y1={phoneY + phoneH - 50}
              y2={phoneY + phoneH - 50}
              stroke={INK}
              strokeOpacity="0.18"
            />
            <g
              fill={INK}
              fillOpacity="0.5"
              fontFamily="inherit"
              fontSize="8"
              style={{ letterSpacing: "0.16em" }}
              textAnchor="middle"
            >
              <text x={x + 30} y={phoneY + phoneH - 28}>
                HOME
              </text>
              <text x={x + 70} y={phoneY + phoneH - 28}>
                WEEK
              </text>
              <text x={x + 110} y={phoneY + phoneH - 28}>
                +
              </text>
              <text x={x + 150} y={phoneY + phoneH - 28}>
                YOU
              </text>
            </g>
            {/* highlight buried + */}
            <circle
              cx={x + 110}
              cy={phoneY + phoneH - 32}
              r="11"
              fill="none"
              stroke={ACCENT}
              strokeOpacity="0.6"
              strokeDasharray="2 2"
            />
            <text
              x={x + phoneW / 2}
              y={phoneY + phoneH + 22}
              textAnchor="middle"
              fontFamily="inherit"
              fontSize="10"
              fill={INK}
              fillOpacity="0.7"
              fontWeight="300"
            >
              Entry buried in tab nav
            </text>
          </>
        ) : (
          <>
            {/* center floating button */}
            <circle
              cx={x + phoneW / 2}
              cy={phoneY + phoneH - 36}
              r="22"
              fill={ACCENT}
              fillOpacity="0.92"
            />
            <text
              x={x + phoneW / 2}
              y={phoneY + phoneH - 31}
              textAnchor="middle"
              fontFamily="inherit"
              fontSize="22"
              fill="#f8f6f1"
              fontWeight="300"
            >
              +
            </text>
            <text
              x={x + phoneW / 2}
              y={phoneY + phoneH + 22}
              textAnchor="middle"
              fontFamily="inherit"
              fontSize="10"
              fill={INK}
              fillOpacity="0.7"
              fontWeight="300"
            >
              Always reachable, voice-first
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {drawPhone(startX, "BEFORE", false)}
      {drawPhone(startX + phoneW + gap, "AFTER", true)}

      {/* arrow between */}
      <g>
        <line
          x1={startX + phoneW + 12}
          x2={startX + phoneW + gap - 12}
          y1={phoneY + phoneH / 2}
          y2={phoneY + phoneH / 2}
          stroke={INK}
          strokeOpacity="0.4"
        />
        <path
          d={`M ${startX + phoneW + gap - 12} ${phoneY + phoneH / 2} l -6 -4 M ${startX + phoneW + gap - 12} ${phoneY + phoneH / 2} l -6 4`}
          stroke={INK}
          strokeOpacity="0.4"
          fill="none"
        />
      </g>
    </svg>
  );
}

function AICorrectionLoopChart() {
  const w = 600;
  const h = 340;
  const cx = w / 2;
  const cy = h / 2;
  const r = 88;

  const nodes = [
    { angle: -Math.PI / 2, label: "AI infers readiness", sub: "from signals" },
    { angle: 0, label: "Suggests plan", sub: "tasks · windows · timing" },
    { angle: Math.PI / 2, label: "User confirms / adjusts", sub: "one-tap edit" },
    { angle: Math.PI, label: "System learns", sub: "edits weighted highest" },
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* loop ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={INK}
        strokeOpacity="0.18"
        strokeDasharray="3 4"
      />

      {/* arrow tips around the ring */}
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const a = -Math.PI / 2 + t * 2 * Math.PI - 0.04;
        const px = cx + r * Math.cos(a);
        const py = cy + r * Math.sin(a);
        const tx = -Math.sin(a);
        const ty = Math.cos(a);
        return (
          <path
            key={t}
            d={`M ${px} ${py} l ${tx * 6 - ty * 4} ${ty * 6 + tx * 4} M ${px} ${py} l ${tx * 6 + ty * 4} ${ty * 6 - tx * 4}`}
            stroke={INK}
            strokeOpacity="0.4"
            fill="none"
          />
        );
      })}

      {/* nodes */}
      {nodes.map((n, i) => {
        const px = cx + r * Math.cos(n.angle);
        const py = cy + r * Math.sin(n.angle);

        // outward label position
        const lx = cx + (r + 56) * Math.cos(n.angle);
        const ly = cy + (r + 56) * Math.sin(n.angle);
        const anchor =
          n.angle === 0
            ? "start"
            : n.angle === Math.PI
            ? "end"
            : "middle";

        return (
          <g key={i}>
            <circle cx={px} cy={py} r="6" fill={ACCENT} />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontFamily="inherit"
              fontSize="11"
              fill={INK}
              fillOpacity="0.9"
              fontWeight="400"
            >
              {n.label}
            </text>
            <text
              x={lx}
              y={ly + 14}
              textAnchor={anchor}
              fontFamily="inherit"
              fontSize="9"
              fill={INK}
              fillOpacity="0.5"
              style={{ letterSpacing: "0.16em" }}
            >
              {n.sub.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* center label */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="9"
        fill={INK}
        fillOpacity="0.5"
        style={{ letterSpacing: "0.2em" }}
      >
        TRUST LOOP
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="11"
        fill={INK}
        fillOpacity="0.85"
        fontWeight="300"
      >
        Every override is signal
      </text>
    </svg>
  );
}

const REGISTRY: Record<ChartId, React.ComponentType> = {
  "diary-structure": DiaryStructureChart,
  "energy-rhythm": EnergyRhythmInteractive,
  "signal-flow": SignalFlowChart,
  "elastic-deadline": ElasticDeadlineChart,
  "readiness-mapping": ReadinessMappingChart,
  "before-after-entry": BeforeAfterEntryChart,
  "ai-correction-loop": AICorrectionLoopChart,
};

type ChartProps = {
  id: ChartId;
  caption?: string;
  ratio?: ImageRatio;
};

export function Chart({ id, caption, ratio = "16/9" }: ChartProps) {
  const C = REGISTRY[id];
  return (
    <ChartFrame kind={id} ratio={ratio} caption={caption}>
      <C />
    </ChartFrame>
  );
}

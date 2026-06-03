/* ─────────────────────────────────────────────────────────────────────────
   Binary marks
   The seven silhouettes a visitor can stamp into the footer. Each is a plain
   SVG path (one closed region, possibly several subpaths) that BinaryGlyph
   fills with a field of 0/1 digits — echoing the Hero's binary particles.

   No AI, no storage. The shape is authored here; the binary fill is generated
   deterministically from a seed at render time.
   ───────────────────────────────────────────────────────────────────────── */

export type MarkId =
  | "dog"
  | "heart"
  | "flower"
  | "robot"
  | "coffee"
  | "rocket"
  | "spark";

export type BinaryMark = {
  id: MarkId;
  label: string;
  viewBox: { w: number; h: number };
  /** Closed silhouette path in the mark's own viewBox coordinate space. */
  path: string;
};

/** Two-arc circle as an SVG subpath. Used for paw beans and flower petals. */
function circle(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
}

const DOG_PATH = [
  // Main paw pad.
  `M 100 186
   C 64 186, 44 161, 46 131
   C 47 110, 70 96, 100 96
   C 130 96, 153 110, 154 131
   C 156 161, 136 186, 100 186 Z`,
  // Four toe beans.
  circle(50, 80, 17),
  circle(83, 58, 18),
  circle(117, 58, 18),
  circle(150, 80, 17),
].join(" ");

const HEART_PATH = `
  M 100 176
  C 42 132, 12 97, 12 62
  C 12 32, 37 16, 62 16
  C 82 16, 96 29, 100 46
  C 104 29, 118 16, 138 16
  C 163 16, 188 32, 188 62
  C 188 97, 158 132, 100 176 Z
`;

const FLOWER_PATH = [
  circle(100, 48, 34),
  circle(50, 84, 34),
  circle(69, 142, 34),
  circle(131, 142, 34),
  circle(150, 84, 34),
  circle(100, 100, 27),
].join(" ");

// Angular mechanical sole — octagonal so it reads as a robot tread, not a paw.
const ROBOT_PATH = `
  M 70 18 L 110 18 L 150 50 L 150 150 L 120 196 L 60 196 L 30 150 L 30 50 Z
`;

const COFFEE_PATH = [
  // Cup body (tapered).
  `M 45 58 L 140 58 L 130 160 Q 128 176 112 176 L 73 176 Q 57 176 55 160 Z`,
  // Handle.
  `M 140 76 Q 180 76 180 108 Q 180 140 140 140 L 140 123 Q 162 123 162 108 Q 162 93 140 93 Z`,
].join(" ");

const ROCKET_PATH = [
  // Body + nose cone.
  `M 85 14 C 110 40 121 80 121 121 L 121 160 L 49 160 L 49 121 C 49 80 60 40 85 14 Z`,
  // Left + right fins.
  `M 49 132 L 24 178 L 49 166 Z`,
  `M 121 132 L 146 178 L 121 166 Z`,
  // Nozzle.
  `M 62 160 L 108 160 L 98 186 L 72 186 Z`,
].join(" ");

// Four-point sparkle with concave sides.
const SPARK_PATH = `
  M 100 10
  C 108 70, 130 92, 190 100
  C 130 108, 108 130, 100 190
  C 92 130, 70 108, 10 100
  C 70 92, 92 70, 100 10 Z
`;

export const BINARY_MARKS: BinaryMark[] = [
  { id: "dog", label: "Dog", viewBox: { w: 200, h: 210 }, path: DOG_PATH },
  { id: "heart", label: "Heart", viewBox: { w: 200, h: 190 }, path: HEART_PATH },
  { id: "flower", label: "Flower", viewBox: { w: 200, h: 200 }, path: FLOWER_PATH },
  { id: "robot", label: "Robot", viewBox: { w: 180, h: 210 }, path: ROBOT_PATH },
  { id: "coffee", label: "Coffee", viewBox: { w: 200, h: 190 }, path: COFFEE_PATH },
  { id: "rocket", label: "Rocket", viewBox: { w: 170, h: 215 }, path: ROCKET_PATH },
  { id: "spark", label: "Spark", viewBox: { w: 200, h: 200 }, path: SPARK_PATH },
];

export const MARK_BY_ID: Record<MarkId, BinaryMark> = BINARY_MARKS.reduce(
  (acc, mark) => {
    acc[mark.id] = mark;
    return acc;
  },
  {} as Record<MarkId, BinaryMark>,
);

/** A single, softly lit particle volume for the Focused Minimal composition. */
export function createRibbonField(coarse: boolean) {
  const positions: number[] = [], appearances: number[] = [];
  const fract = (value: number) => value - Math.floor(value);
  const random = (value: number) => fract(Math.sin(value * 127.1) * 43758.5453123);
  const count = coarse ? 24000 : 48000;
  for (let i = 1; i <= count; i++) {
    const seed = random(i);
    const angle = fract(i * .61803398875) * Math.PI * 2;
    const spread = Math.sqrt(-2 * Math.log(Math.max(.001, random(i + 7919)))) * Math.cos(seed * Math.PI * 2);
    const haze = i % 9 === 0;
    const digit = i % 23 === 0;
    const crossSection = random(i + 15401) * Math.PI * 2;
    const tube = .039 * Math.sqrt(random(i + 31337));
    const radius = .258 + Math.cos(crossSection) * tube + spread * (haze ? .025 : .007);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    // The upper-left edge dissolves into light; the right and lower rim carry depth.
    const light = .23 + .77 * (.5 + .5 * Math.cos(angle - .55));
    const edge = Math.exp(-spread * spread * .17);
    const alpha = (digit ? .24 : haze ? .037 : .19) * light * edge;
    // Populate a tube in three dimensions, including its front and rear surfaces.
    const depth = Math.sin(angle + .5) * .28 + Math.sin(crossSection) * tube * 5 + spread * .025;
    positions.push(.5 + x / 1.83, .52 + y, depth);
    appearances.push(digit ? 1 : 0, seed, alpha, digit ? 6 + seed * 3 : haze ? 5 + seed * 5 : 1 + seed * 1.7);
  }
  // Intro-only glyphs travel from the foreground into the existing calm volume.
  // Keep the published glyph size, with a lighter, more open falling field.
  const arrivals = coarse ? 450 : 900;
  for (let i = 0; i < arrivals; i++) {
    const seed = random(i + 901);
    const angle = fract((i + 1) * .61803398875) * Math.PI * 2;
    const radius = .258 + (random(i + 401) - .5) * .065;
    const depth = Math.sin(angle + .5) * .28;
    positions.push(
      .5 + Math.cos(angle) * radius / 1.83,
      .52 + Math.sin(angle) * radius,
      depth,
    );
    appearances.push(2, seed, .28 + random(i + 2101) * .16, (coarse ? 8.5 : 10.5) + (depth + .7) * 2);
  }
  return {
    positions: new Float32Array(positions),
    appearances: new Float32Array(appearances),
    count: positions.length / 3,
  };
}

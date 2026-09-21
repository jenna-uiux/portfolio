/** A shared light source in viewport coordinates; updates without React rerenders. */
export type HeadlineInteraction = {
  x: number;
  y: number;
  light: number;
};

export function createHeadlineInteraction(): HeadlineInteraction {
  return { x: -999, y: -999, light: 0 };
}

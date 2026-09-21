/** A shared light source in viewport coordinates; updates without React rerenders. */
export type HeadlineInteraction = {
  x: number;
  y: number;
  light: number;
  soundPreview: number;
  soundEnabled: boolean;
  scrollPreview: number;
  scrollAt: number;
};

export function createHeadlineInteraction(): HeadlineInteraction {
  return { x: -999, y: -999, light: 0, soundPreview: 0, soundEnabled: false, scrollPreview: 0, scrollAt: -1 };
}

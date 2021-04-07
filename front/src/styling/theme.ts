export const theme = {
  canvas: "#202020",
  canvasSub: "#303030",
  textMain: "#bab9b0",
  textSub: "#ccc",
  colorMain: "#f0e040",
  colorPallete: {
    1: "#154060",
    2: "#237579",
  },
  good: "#205630",
  bad: "#562525",
} as const;

export type Theme = typeof theme;

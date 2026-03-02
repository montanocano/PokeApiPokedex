
//Font size scale (fontSize)
export const fontSize = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  h3: 20,
  h2: 24,
  h1: 32,
} as const;

//Line heights matching each size
export const lineHeight = {
  caption: 16,
  bodySmall: 20,
  body: 24,
  h3: 26,
  h2: 30,
  h1: 38,
} as const;

//Font weights (fontWeight)
export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

//Font families
export const fontFamily = {
  body: "System",
  heading: "System",
  mono: "RobotoMono",
} as const;
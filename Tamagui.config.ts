import { createTamagui, createTokens, createFont } from "tamagui";

//Fonts
const bodyFont = createFont({
  family: "System",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 26,
    5: 30,
    6: 38,
  },
  weight: {
    4: "400",
    5: "500",
    6: "600",
    7: "700",
  },
  letterSpacing: {
    4: 0,
    5: 0,
  },
});

const monoFont = createFont({
  family: "RobotoMono",
  size: {
    1: 12,
    2: 14,
  },
  lineHeight: {
    1: 16,
    2: 18,
  },
  weight: {
    5: "500",
  },
});

//Tokens
const tokens = createTokens({
  size: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    true: 16,
  },
  space: {
    0: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    true: 16,
  },
  radius: {
    0: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
    true: 12,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
  color: {
    // Primary palette
    primary: "#DC0A2D",
    primaryLight: "#FF1C47",
    primaryDark: "#A30721",
    secondary: "#3B4CCA",
    secondaryLight: "#5B6BDB",
    accent: "#FFDE00",
    accentDark: "#CC9900",

    // Backgrounds
    background: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceHover: "#F0F0F0",

    // Text
    textPrimary: "#1A1A2E",
    textSecondary: "#6B7280",
    textDisabled: "#9CA3AF",
    textOnPrimary: "#FFFFFF",

    // Borders
    border: "#E5E7EB",
    borderFocus: "#3B4CCA",

    // Status
    success: "#16A34A",
    warning: "#EA580C",
    error: "#DC2626",

    // Pokemon type colors
    typeNormal: "#A8A77A",
    typeFire: "#EE8130",
    typeWater: "#6390F0",
    typeElectric: "#F7D02C",
    typeGrass: "#7AC74C",
    typeIce: "#96D9D6",
    typeFighting: "#C22E28",
    typePoison: "#A33EA1",
    typeGround: "#E2BF65",
    typeFlying: "#A98FF3",
    typePsychic: "#F95587",
    typeBug: "#A6B91A",
    typeRock: "#B6A136",
    typeGhost: "#735797",
    typeDragon: "#6F35FC",
    typeDark: "#705746",
    typeSteel: "#B7B7CE",
    typeFairy: "#D685AD",

    // Transparent
    transparent: "transparent",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
});

//Themes
const lightTheme = {
  background: tokens.color.background,
  backgroundHover: tokens.color.surfaceHover,
  backgroundPress: tokens.color.border,
  backgroundFocus: tokens.color.surface,
  color: tokens.color.textPrimary,
  colorHover: tokens.color.textPrimary,
  colorPress: tokens.color.textSecondary,
  colorFocus: tokens.color.textPrimary,
  borderColor: tokens.color.border,
  borderColorHover: tokens.color.borderFocus,
  borderColorFocus: tokens.color.borderFocus,
  borderColorPress: tokens.color.border,
  shadowColor: "rgba(0, 0, 0, 0.1)",
  shadowColorHover: "rgba(0, 0, 0, 0.15)",
};

const darkTheme = {
  background: "#1A1A2E",
  backgroundHover: "#252540",
  backgroundPress: "#16162B",
  backgroundFocus: "#252540",
  color: "#F5F5F5",
  colorHover: "#FFFFFF",
  colorPress: "#9CA3AF",
  colorFocus: "#F5F5F5",
  borderColor: "#374151",
  borderColorHover: "#5B6BDB",
  borderColorFocus: "#5B6BDB",
  borderColorPress: "#374151",
  shadowColor: "rgba(0, 0, 0, 0.4)",
  shadowColorHover: "rgba(0, 0, 0, 0.5)",
};

//Config
const config = createTamagui({
  defaultFont: "body",
  fonts: {
    body: bodyFont,
    mono: monoFont,
    heading: bodyFont,
  },
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  shorthands: {
    px: "paddingHorizontal",
    py: "paddingVertical",
    mx: "marginHorizontal",
    my: "marginVertical",
    bg: "backgroundColor",
    br: "borderRadius",
    w: "width",
    h: "height",
    f: "flex",
    ai: "alignItems",
    jc: "justifyContent",
    fd: "flexDirection",
    fw: "flexWrap",
    gap: "gap",
  } as const,
  media: {
    sm: { maxWidth: 640 },
    md: { maxWidth: 768 },
    lg: { maxWidth: 1024 },
  },
});

export type AppConfig = typeof config;

// Make TypeScript aware of the config
declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
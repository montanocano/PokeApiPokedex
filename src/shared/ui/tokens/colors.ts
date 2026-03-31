//1. Primary palette
export const primaryColors = {
  primary: "#DC0A2D",
  primaryLight: "#FF1C47",
  primaryDark: "#A30721",
  secondary: "#3B4CCA",
  secondaryLight: "#5B6BDB",
  secondaryDark: "#2A3A9E",
  accent: "#FFDE00",
  accentDark: "#CC9900",
} as const;

//2. Pokémon type colors
export const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
} as const;

export type PokemonTypeName = keyof typeof typeColors;

//3. Light and dark themes
export const lightColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceHover: "#F0F0F0",
  surfacePress: "#E8E8E8",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
  textOnPrimary: "#FFFFFF",
  textOnAccent: "#1A1A2E",
  border: "#E5E7EB",
  borderFocus: "#3B4CCA",
  divider: "#F3F4F6",
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowStrong: "rgba(0, 0, 0, 0.15)",
} as const;

export const darkColors = {
  background: "#1A1A2E",
  surface: "#252540",
  surfaceHover: "#2E2E50",
  surfacePress: "#16162B",
  textPrimary: "#F5F5F5",
  textSecondary: "#9CA3AF",
  textDisabled: "#6B7280",
  textOnPrimary: "#FFFFFF",
  textOnAccent: "#1A1A2E",
  border: "#374151",
  borderFocus: "#5B6BDB",
  divider: "#2D2D48",
  overlay: "rgba(0, 0, 0, 0.7)",
  shadow: "rgba(0, 0, 0, 0.4)",
  shadowStrong: "rgba(0, 0, 0, 0.5)",
} as const;

// 4. Stat range colors (used in the detail screen progress bars)
export const statColors = {
  statLow: "#E74C3C", // base stat < 50
  statMid: "#F39C12", // base stat 50–79
  statHigh: "#2ECC71", // base stat >= 80
} as const;

// 5. Status colors (success, error, warning)
export const statusColors = {
  success: "#16A34A",
  successLight: "#22C55E",
  successBg: "#F0FDF4",
  warning: "#EA580C",
  warningLight: "#F97316",
  warningBg: "#FFF7ED",
  error: "#DC2626",
  errorLight: "#EF4444",
  errorBg: "#FEF2F2",
  info: "#2563EB",
  infoLight: "#3B82F6",
  infoBg: "#EFF6FF",
} as const;

//Combined export for tamagui.config.ts
// Spread this into createTokens({ color: { ...allColors } })
export const allColors = {
  ...primaryColors,
  ...Object.fromEntries(
    Object.entries(typeColors).map(([key, val]) => [
      `type${key[0].toUpperCase()}${key.slice(1)}`,
      val,
    ]),
  ),
  ...lightColors,
  ...statusColors,
  ...statColors,
  transparent: "transparent",
} as const;

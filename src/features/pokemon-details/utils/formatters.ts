// Pokemon ID display: 1 → "#001"
export function formatId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

// Capitalize first letter of a string
export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// API returns decimeters → display in meters
export function formatHeight(dm: number): string {
  return `${(dm / 10).toFixed(1)} m`;
}

// API returns hectograms → display in kilograms
export function formatWeight(hg: number): string {
  return `${(hg / 10).toFixed(1)} kg`;
}

// Human-readable label for each stat key coming from the API
export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "Sp.Atk",
  "special-defense": "Sp.Def",
  speed: "Speed",
};

// Maximum base stat value — used to scale progress bars
export const MAX_STAT = 255;

// types for the pokeapi responses

// the api uses this everywhere, its like a reference with name and url
export interface NamedAPIResource {
  name: string;
  url: string;
}

// generic paginated response (GET /pokemon, GET /type, etc)
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// the 18 pokemon types - using a const tuple so we can derive both the type and the guard from it
export const POKEMON_TYPE_NAMES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPE_NAMES)[number];

// each pokemon has 1 or 2 types, this is how it comes in the types array
export interface PokemonTypeEntry {
  slot: number;
  type: NamedAPIResource;
}

// stats
export type StatName =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

// abilities
export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

// sprites - only the ones we actually need
export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

// moves (we only show the first 20)
export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
}

// main pokemon interface - response from GET /pokemon/{id}
export interface Pokemon {
  id: number;
  name: string;
  height: number; // in decimeters
  weight: number; // in hectograms
  base_experience: number | null;
  types: PokemonTypeEntry[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  moves: PokemonMove[];
  species: NamedAPIResource;
}

// GET /pokemon?offset=0&limit=30
export type PokemonListResponse = PaginatedResponse<NamedAPIResource>;

// GET /pokemon/{id} - same as Pokemon but makes it clearer when reading the code
export type PokemonDetailResponse = Pokemon;

// GET /type/{name} - response with all pokemon of that type
export interface TypeDetailResponse {
  id: number;
  name: string;
  pokemon: {
    pokemon: NamedAPIResource;
    slot: number;
  }[];
}

// type guard - derives from the same tuple so there's no duplication
export function isPokemonTypeName(value: string): value is PokemonTypeName {
  return (POKEMON_TYPE_NAMES as readonly string[]).includes(value);
}

// --- parsed types (camelCase) for the detail screen ---
// the api returns snake_case so we transform it into these

export interface ParsedStat {
  baseStat: number;
  effort: number;
  statName: string;
}

export interface ParsedAbility {
  abilityName: string;
  isHidden: boolean;
  slot: number;
}

export interface ParsedSprites {
  frontDefault: string | null;
  frontShiny: string | null;
  officialArtwork: string | null;
  home: string | null;
}

export interface ParsedMove {
  moveName: string;
  levelLearnedAt: number;
  learnMethod: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  baseExperience: number; // defaults to 0 if the api returns null
  types: PokemonTypeName[];
  stats: ParsedStat[];
  abilities: ParsedAbility[];
  sprites: ParsedSprites;
  moves: ParsedMove[];
  speciesUrl: string;
}

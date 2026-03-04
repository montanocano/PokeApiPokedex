// tipos para las respuestas de la PokeAPI
// sacados de https://pokeapi.co/docs/v2

// esto lo usa la api en todos lados, es como una referencia con nombre y url
export interface NamedAPIResource {
  name: string;
  url: string;
}

// respuesta paginada genérica (GET /pokemon, GET /type, etc)
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// los 18 tipos de pokemon
export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

// cada pokemon tiene 1 o 2 tipos, esto es como viene en el array types
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

// sprites - solo los que vamos a usar
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

// moves (solo vamos a mostrar los primeros 20)
export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
  }[];
}

// interfaz principal - respuesta de GET /pokemon/{id}
export interface Pokemon {
  id: number;
  name: string;
  height: number; // en decímetros
  weight: number; // en hectogramos
  base_experience: number;
  types: PokemonTypeEntry[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  moves: PokemonMove[];
  species: NamedAPIResource;
}

// GET /pokemon?offset=0&limit=30
export type PokemonListResponse = PaginatedResponse<NamedAPIResource>;

// GET /pokemon/{id} - es lo mismo que Pokemon pero queda más claro al usarlo
export type PokemonDetailResponse = Pokemon;

// type guard por si acaso - para validar que un string es un tipo valido
const validTypes: PokemonTypeName[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export function isPokemonTypeName(value: string): value is PokemonTypeName {
  return validTypes.includes(value as PokemonTypeName);
}
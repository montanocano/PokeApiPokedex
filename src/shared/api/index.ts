export { apiClient } from "./client";
export { ApiString } from "./apiString";
export { ApiTimeoutError, ApiNetworkError, ApiHttpError } from "./client";

export type {
  NamedAPIResource,
  PaginatedResponse,
  PokemonTypeName,
  PokemonTypeEntry,
  StatName,
  PokemonStat,
  PokemonAbility,
  PokemonSprites,
  PokemonMove,
  Pokemon,
  PokemonListResponse,
  PokemonDetailResponse,
} from "./Types";

export { isPokemonTypeName } from "./Types";

export {
  getPokemonList,
  getPokemonById,
  getPokemonByType,
  extractIdFromUrl,
} from "./PokemonService";
export { isPokemonTypeName, POKEMON_TYPE_NAMES } from "./Types";

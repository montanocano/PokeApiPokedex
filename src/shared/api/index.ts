export { apiClient } from "./client";
export type { ApiClient } from "./client";
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
  TypeDetailResponse,
  PokemonDetail,
  ParsedStat,
  ParsedAbility,
  ParsedSprites,
  ParsedMove,
} from "./Types";

export { isPokemonTypeName, POKEMON_TYPE_NAMES } from "./Types";

export {
  getPokemonList,
  getPokemonById,
  getPokemonByType,
  extractIdFromUrl,
} from "./PokemonService";

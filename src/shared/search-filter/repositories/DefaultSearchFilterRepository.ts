import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import type { PokemonTypeName } from "../../api/Types";

// criteria that can be applied to filter the pokemon list
export interface FilterCriteria {
  searchQuery: string;
  // multiple types: pokemon must match at least one (OR logic)
  selectedTypes: PokemonTypeName[];
  // null means no generation filter active
  selectedGeneration: number | null;
}

// repository interface for filtering — any implementation must provide filterPokemon
// using an interface keeps the hook decoupled from the implementation (easy to swap in tests)
export interface SearchFilterRepository {
  filterPokemon(
    list: PokemonListItem[],
    criteria: FilterCriteria,
  ): PokemonListItem[];
}

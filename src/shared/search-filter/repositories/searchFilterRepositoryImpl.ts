import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import type {
  FilterCriteria,
  SearchFilterRepository,
} from "./DefaultSearchFilterRepository";

// client-side implementation — no network calls needed since types are already in PokemonListItem
export const defaultSearchFilterRepository: SearchFilterRepository = {
  filterPokemon(
    list: PokemonListItem[],
    criteria: FilterCriteria,
  ): PokemonListItem[] {
    // case-insensitive search
    const query = criteria.searchQuery.trim().toLowerCase();

    return list.filter((pokemon) => {
      const matchesName =
        query === "" || pokemon.name.toLowerCase().includes(query);

      // AND logic: show pokemon that have ALL of the selected types
      const matchesType =
        criteria.selectedTypes.length === 0 ||
        criteria.selectedTypes.every((t) => pokemon.types.includes(t));

      // combined: both conditions must hold (AND logic between name and type)
      return matchesName && matchesType;
    });
  },
};

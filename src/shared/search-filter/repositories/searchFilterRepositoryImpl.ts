import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import type {
  FilterCriteria,
  SearchFilterRepository,
} from "./DefaultSearchFilterRepository";

// ID ranges for each generation (inclusive)
const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, Infinity],
};

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

      // generation filter: check if pokemon ID falls within the generation's range
      const matchesGeneration =
        criteria.selectedGeneration === null ||
        (() => {
          const range = GENERATION_RANGES[criteria.selectedGeneration];
          return (
            range !== undefined &&
            pokemon.id >= range[0] &&
            pokemon.id <= range[1]
          );
        })();

      return matchesName && matchesType && matchesGeneration;
    });
  },
};

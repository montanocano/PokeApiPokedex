import type { PokemonListItem } from "../../repositories/DefaultPokemonRepository";
import type { PokemonTypeName } from "../../../../shared/api/Types";

export interface FilterCriteria {
  searchQuery: string;
  // multiple types: pokemon must match all selected types (AND logic)
  selectedTypes: PokemonTypeName[];
  // null means no generation filter active
  selectedGeneration: number | null;
}

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

/**
 * Pure synchronous filter over an already-loaded list.
 *
 * NOTE: results are limited to whatever pages have been fetched at the time
 * this runs. If the user filters for a Pokémon from a generation that has not
 * yet been loaded by infinite scroll, the result will appear empty until that
 * page arrives. No guard or hint is shown in the UI for this case.
 */
export function filterPokemon(
  list: PokemonListItem[],
  criteria: FilterCriteria,
): PokemonListItem[] {
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
}

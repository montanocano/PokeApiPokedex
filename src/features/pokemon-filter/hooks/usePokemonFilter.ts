import { useCallback } from "react";
import {
  usePokemonFilterStore,
  selectFilteredList,
  selectActiveFilterCount,
  selectSearchQuery,
  selectActiveTypes,
  selectActiveGenerations,
} from "../store/pokemonFilterStore";
import type { PokemonTypeName } from "../../../shared/api";
import type { PokemonListItem } from "../../pokemon-list/store/pokemonListStore";

export function usePokemonFilter(allPokemon: PokemonListItem[]) {
  const filteredList = usePokemonFilterStore(selectFilteredList);
  const activeFilterCount = usePokemonFilterStore(selectActiveFilterCount);
  const searchQuery = usePokemonFilterStore(selectSearchQuery);
  const activeTypes = usePokemonFilterStore(selectActiveTypes);
  const activeGenerations = usePokemonFilterStore(selectActiveGenerations);

  const { setSearchQuery, applyFilter, clearFilters } = usePokemonFilterStore();

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query, allPokemon);
    },
    [setSearchQuery, allPokemon],
  );

  const handleApplyFilter = useCallback(
    (criteria: { types?: PokemonTypeName[]; generations?: number[] }) => {
      applyFilter(criteria, allPokemon);
    },
    [applyFilter, allPokemon],
  );

  const handleClearFilters = useCallback(() => {
    clearFilters(allPokemon);
  }, [clearFilters, allPokemon]);

  return {
    filteredList,
    activeFilterCount,
    searchQuery,
    activeTypes,
    activeGenerations,
    handleSearchChange,
    handleApplyFilter,
    handleClearFilters,
  };
}

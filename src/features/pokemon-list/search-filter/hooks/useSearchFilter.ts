import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchFilterStore } from "../store/store";
import {
  selectSearchQuery,
  selectSelectedTypes,
  selectSelectedGeneration,
  selectSetSearchQuery,
  selectToggleType,
  selectToggleGeneration,
  selectClearFilters,
} from "../store/searchFilterStore";
import { filterPokemon } from "../utils/filterPokemon";
import type { PokemonListItem } from "../../repositories/DefaultPokemonRepository";
import type { PokemonTypeName } from "../../../../shared/api/Types";

const DEBOUNCE_MS = 300;

interface UseSearchFilterOptions {
  list: PokemonListItem[];
}

// filteredList is intentionally derived per-consumer in this hook rather than
// stored in the SearchFilterStore. The store owns filter criteria only; the
// result is computed here so the store stays a pure criteria container and
// avoids coupling it to the list state owned by usePokemonList.
export function useSearchFilter({ list }: UseSearchFilterOptions) {
  const searchQuery = useSearchFilterStore(selectSearchQuery);
  const selectedTypes = useSearchFilterStore(selectSelectedTypes);
  const selectedGeneration = useSearchFilterStore(selectSelectedGeneration);
  const setSearchQuery = useSearchFilterStore(selectSetSearchQuery);
  const toggleType = useSearchFilterStore(selectToggleType);
  const toggleGeneration = useSearchFilterStore(selectToggleGeneration);
  const clearFilters = useSearchFilterStore(selectClearFilters);

  // inputValue mirrors what the user is typing — updates immediately so the UI feels responsive
  // the actual store query is debounced to avoid filtering on every keystroke
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // action: search by name — debounced 300ms before updating the store
  const handleSearchChange = useCallback(
    (text: string) => {
      setInputValue(text);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(text);
      }, DEBOUNCE_MS);
    },
    [setSearchQuery],
  );

  // sync inputValue when the store query is reset externally (e.g., via clearFilters)
  useEffect(() => {
    if (searchQuery === "" && inputValue !== "") {
      setInputValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // cleanup pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // action: toggle a type on/off — multiple types can be active simultaneously
  const handleTypeToggle = useCallback(
    (type: PokemonTypeName) => {
      toggleType(type);
    },
    [toggleType],
  );

  // action: select a generation — passing the same gen again deselects it (toggle)
  const handleGenerationChange = useCallback(
    (gen: number) => {
      toggleGeneration(gen);
    },
    [toggleGeneration],
  );

  // action: clear filters — also cancels any pending debounce to prevent stale query
  const handleClearFilters = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    clearFilters();
    setInputValue("");
  }, [clearFilters]);

  // selector: filtered pokemon — memoized so it only recomputes when deps change
  const filteredList = useMemo(
    () =>
      filterPokemon(list, { searchQuery, selectedTypes, selectedGeneration }),
    [list, searchQuery, selectedTypes, selectedGeneration],
  );

  return {
    inputValue,
    searchQuery,
    selectedTypes,
    selectedGeneration,
    filteredList,
    handleSearchChange,
    handleTypeToggle,
    handleGenerationChange,
    handleClearFilters,
  };
}

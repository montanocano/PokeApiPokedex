import { immer } from "zustand/middleware/immer";
import type { PokemonTypeName } from "../../api/Types";

interface SearchFilterState {
  searchQuery: string;
  // multiple selected types supported
  selectedTypes: PokemonTypeName[];
  // null means "all generations"
  selectedGeneration: number | null;
}

interface SearchFilterActions {
  // action: search by name (store receives the debounced value from the hook)
  setSearchQuery: (query: string) => void;
  // action: toggle a type on/off — adds it if absent, removes it if present
  toggleType: (type: PokemonTypeName) => void;
  // action: set generation — null clears it
  setGeneration: (gen: number | null) => void;
  // action: reset all filters at once
  clearFilters: () => void;
}

export type SearchFilterStore = SearchFilterState & SearchFilterActions;

export function createSearchFilterStore() {
  return immer<SearchFilterStore>((set) => ({
    // initial state
    searchQuery: "",
    selectedTypes: [],
    selectedGeneration: null,

    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query;
      });
    },

    toggleType: (type) => {
      set((state) => {
        const idx = state.selectedTypes.indexOf(type);
        if (idx === -1) {
          state.selectedTypes.push(type);
        } else {
          state.selectedTypes.splice(idx, 1);
        }
      });
    },

    setGeneration: (gen) => {
      set((state) => {
        state.selectedGeneration = gen;
      });
    },

    clearFilters: () => {
      set((state) => {
        state.searchQuery = "";
        state.selectedTypes = [];
        state.selectedGeneration = null;
      });
    },
  }));
}

// selectors — one per state slice so components only re-render when their slice changes
export const selectSearchQuery = (state: SearchFilterStore) =>
  state.searchQuery;
export const selectSelectedTypes = (state: SearchFilterStore) =>
  state.selectedTypes;
export const selectSelectedGeneration = (state: SearchFilterStore) =>
  state.selectedGeneration;
export const selectSetSearchQuery = (state: SearchFilterStore) =>
  state.setSearchQuery;
export const selectToggleType = (state: SearchFilterStore) => state.toggleType;
export const selectSetGeneration = (state: SearchFilterStore) =>
  state.setGeneration;
export const selectClearFilters = (state: SearchFilterStore) =>
  state.clearFilters;

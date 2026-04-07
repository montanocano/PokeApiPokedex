import { immer } from "zustand/middleware/immer";
import type { PokemonTypeName } from "../../api/Types";

interface SearchFilterState {
  searchQuery: string;
  // multiple selected types supported
  selectedTypes: PokemonTypeName[];
}

interface SearchFilterActions {
  // action: search by name (store receives the debounced value from the hook)
  setSearchQuery: (query: string) => void;
  // action: toggle a type on/off — adds it if absent, removes it if present
  toggleType: (type: PokemonTypeName) => void;
  // action: reset both filters at once
  clearFilters: () => void;
}

export type SearchFilterStore = SearchFilterState & SearchFilterActions;

export function createSearchFilterStore() {
  return immer<SearchFilterStore>((set) => ({
    // initial state
    searchQuery: "",
    selectedTypes: [],

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

    clearFilters: () => {
      set((state) => {
        state.searchQuery = "";
        state.selectedTypes = [];
      });
    },
  }));
}

// selectors — one per state slice so components only re-render when their slice changes
export const selectSearchQuery = (state: SearchFilterStore) =>
  state.searchQuery;
export const selectSelectedTypes = (state: SearchFilterStore) =>
  state.selectedTypes;
export const selectSetSearchQuery = (state: SearchFilterStore) =>
  state.setSearchQuery;
export const selectToggleType = (state: SearchFilterStore) => state.toggleType;
export const selectClearFilters = (state: SearchFilterStore) =>
  state.clearFilters;

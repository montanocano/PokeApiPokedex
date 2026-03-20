import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import type { PokemonTypeName } from "../../../shared/api";
import type { PokemonListItem } from "../../pokemon-list/store/pokemonListStore";

export interface FilterCriteria {
  /** Partial name or exact number — empty string means no search filter */
  searchQuery: string;
  /** Selected type chips — empty array means no type filter */
  types: PokemonTypeName[];
  /** Selected generation chips (1–9) — empty array means no generation filter */
  generations: number[];
}

// State & Actions

interface PokemonFilterState {
  searchQuery: string;
  activeTypes: PokemonTypeName[];
  activeGenerations: number[];
  /** Filtered slice of the master list — recomputed on every filter action */
  filteredList: PokemonListItem[];
  /** Number of active filter groups (badge on the filter button) */
  activeFilterCount: number;
}

interface PokemonFilterActions {
  /** Updates the search query and refilters the master list */
  setSearchQuery: (query: string, allPokemon: PokemonListItem[]) => void;
  /** Sets active types and/or generations then refilters */
  applyFilter: (
    criteria: Partial<Pick<FilterCriteria, "types" | "generations">>,
    allPokemon: PokemonListItem[],
  ) => void;
  /** Resets all filter criteria and restores the full list */
  clearFilters: (allPokemon: PokemonListItem[]) => void;
}

export type PokemonFilterStore = PokemonFilterState & PokemonFilterActions;

// Combined filter logic
// Pure function — no side effects, easy to unit-test.
// AND between criteria groups, OR across selected generations.
//
//  1. searchQuery → name includes query (partial, case-insensitive)
//                   OR id starts with query (number search)
//  2. types       → pokemon must have ALL selected types (AND)
//  3. generations → pokemon must belong to ANY selected generation (OR)

/** Derives generation (1–9) from a Pokémon's national dex ID. */
function getGeneration(id: number): number {
  let generation = 9;

  if (id <= 151) generation = 1;
  else if (id <= 251) generation = 2;
  else if (id <= 386) generation = 3;
  else if (id <= 493) generation = 4;
  else if (id <= 649) generation = 5;
  else if (id <= 721) generation = 6;
  else if (id <= 809) generation = 7;
  else if (id <= 905) generation = 8;

  return generation;
}

function matchesSearch(
  pokemon: PokemonListItem,
  normalizedQuery: string,
): boolean {
  const matchesName = pokemon.name.toLowerCase().includes(normalizedQuery);
  const matchesNumber = pokemon.id.toString().startsWith(normalizedQuery);
  return normalizedQuery.length === 0 || matchesName || matchesNumber;
}

function matchesTypes(pokemon: PokemonListItem, types: PokemonTypeName[]): boolean {
  return types.length === 0 || types.every((t) => pokemon.types.includes(t));
}

function matchesGenerations(pokemon: PokemonListItem, generations: number[]): boolean {
  return generations.length === 0 || generations.includes(getGeneration(pokemon.id));
}

function applyFilters(
  allPokemon: PokemonListItem[],
  criteria: FilterCriteria
): PokemonListItem[] {
  const normalizedQuery = criteria.searchQuery.trim().toLowerCase();

  return allPokemon.filter(
    (pokemon) =>
      matchesSearch(pokemon, normalizedQuery) &&
      matchesTypes(pokemon, criteria.types) &&
      matchesGenerations(pokemon, criteria.generations)
  );
}

function countActiveFilters(
  types: PokemonTypeName[],
  generations: number[]
): number {
  return (types.length > 0 ? 1 : 0) + (generations.length > 0 ? 1 : 0);
}

// Store

export const usePokemonFilterStore = create<PokemonFilterStore>()(
  devtools(
    immer((set) => ({
      searchQuery: "",
      activeTypes: [],
      activeGenerations: [],
      filteredList: [],
      activeFilterCount: 0,

      // Search by name or number
      setSearchQuery: (query: string, allPokemon: PokemonListItem[]) => {
        set((state) => {
          state.searchQuery = query;
          state.filteredList = applyFilters(allPokemon, {
            searchQuery: query,
            types: state.activeTypes,
            generations: state.activeGenerations,
          });
        });
      },

      // Apply type and/or generation filters
      applyFilter: (criteria, allPokemon) => {
        set((state) => {
          if (criteria.types !== undefined) state.activeTypes = criteria.types;
          if (criteria.generations !== undefined)
            state.activeGenerations = criteria.generations;

          state.filteredList = applyFilters(allPokemon, {
            searchQuery: state.searchQuery,
            types: state.activeTypes,
            generations: state.activeGenerations,
          });
          state.activeFilterCount = countActiveFilters(
            state.activeTypes,
            state.activeGenerations
          );
        });
      },

      // Clear all filters and restore the full list
      clearFilters: (allPokemon: PokemonListItem[]) => {
        set((state) => {
          state.searchQuery = "";
          state.activeTypes = [];
          state.activeGenerations = [];
          state.filteredList = allPokemon;
          state.activeFilterCount = 0;
        });
      },
    })),
    { name: "pokemon-filter-store" },
  ),
);

// Selectors
export const selectFilteredList = (state: PokemonFilterStore) =>
  state.filteredList;

export const selectActiveFilterCount = (state: PokemonFilterStore) =>
  state.activeFilterCount;

export const selectSearchQuery = (state: PokemonFilterStore) =>
  state.searchQuery;

export const selectActiveTypes = (state: PokemonFilterStore) =>
  state.activeTypes;

export const selectActiveGenerations = (state: PokemonFilterStore) =>
  state.activeGenerations;
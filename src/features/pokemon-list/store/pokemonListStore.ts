import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import type { PokemonTypeName } from "../../../shared/api";

// domain model
export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string | null;
  types: PokemonTypeName[];
}

interface PokemonListState {
  list: PokemonListItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

interface PokemonListActions {
  setList: (items: PokemonListItem[], hasMore: boolean) => void;
  appendList: (items: PokemonListItem[], hasMore: boolean) => void;
  setLoading: (value: boolean) => void;
  setLoadingMore: (value: boolean) => void;
  setError: (message: string | null) => void;
  clearError: () => void;
}

export type PokemonListStore = PokemonListState & PokemonListActions;

export const PAGE_SIZE = 30;

export const usePokemonListStore = create<PokemonListStore>()(
  devtools(
    immer((set) => ({
      list: [],
      offset: 0,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      error: null,

      setList: (items, hasMore) => {
        set((state) => {
          state.list = items;
          state.offset = PAGE_SIZE;
          state.hasMore = hasMore;
        });
      },

      appendList: (items, hasMore) => {
        set((state) => {
          state.list.push(...items);
          state.offset += PAGE_SIZE;
          state.hasMore = hasMore;
        });
      },

      setLoading: (value) => {
        set((state) => {
          state.isLoading = value;
        });
      },

      setLoadingMore: (value) => {
        set((state) => {
          state.isLoadingMore = value;
        });
      },

      setError: (message) => {
        set((state) => {
          state.error = message;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    { name: "pokemon-list-store" },
  ),
);

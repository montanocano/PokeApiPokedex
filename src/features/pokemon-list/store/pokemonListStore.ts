import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { getPokemonList, getPokemonListItems, PAGE_SIZE } from "../../../shared/api";
import type { PokemonTypeName } from "../../../shared/api";

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
  fetchPokemonList: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  refreshList: () => Promise<void>;
  clearError: () => void;
}

export type PokemonListStore = PokemonListState & PokemonListActions;

export const usePokemonListStore = create<PokemonListStore>()(
  devtools(
    immer((set, get) => ({
      list: [],
      offset: 0,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      error: null,

      fetchPokemonList: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        try {
          const response = await getPokemonList(0, PAGE_SIZE);
          const items = await getPokemonListItems(response.results);
          set((state) => {
            state.list = items;
            state.offset = PAGE_SIZE;
            state.hasMore = response.next !== null;
            state.isLoading = false;
          });
        } catch (e) {
          set((state) => {
            state.error = e instanceof Error ? e.message : "Something went wrong";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const { isLoadingMore, hasMore, offset } = get();
        if (isLoadingMore || !hasMore) return;

        set((state) => {
          state.isLoadingMore = true;
          state.error = null;
        });
        try {
          const response = await getPokemonList(offset, PAGE_SIZE);
          const items = await getPokemonListItems(response.results);
          set((state) => {
            state.list.push(...items);
            state.offset += PAGE_SIZE;
            state.hasMore = response.next !== null;
            state.isLoadingMore = false;
          });
        } catch (e) {
          set((state) => {
            state.error = e instanceof Error ? e.message : "Something went wrong";
            state.isLoadingMore = false;
          });
        }
      },

      refreshList: async () => {
        set((state) => {
          state.list = [];
          state.offset = 0;
          state.hasMore = true;
        });
        await get().fetchPokemonList();
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

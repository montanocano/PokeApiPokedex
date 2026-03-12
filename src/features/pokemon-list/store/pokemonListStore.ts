import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { getPokemonList, getPokemonById } from "../../../shared/api";
import type { NamedAPIResource, PokemonTypeName } from "../../../shared/api";

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
  fetchPokemonList: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  clearError: () => void;
}

type PokemonListStore = PokemonListState & PokemonListActions;

const PAGE_SIZE = 30;

export const usePokemonListStore = create<PokemonListStore>()(
  devtools(
    immer((set, get) => ({
      // initial state
      list: [],
      offset: 0,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      error: null,

      // fetch first page
      fetchPokemonList: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await getPokemonList(0, PAGE_SIZE);

          const items = await Promise.all(
            response.results.map(async (ref: NamedAPIResource) => {
              const pokemon = await getPokemonById(ref.name);
              return {
                id: pokemon.id,
                name: pokemon.name,
                sprite: pokemon.sprites.front_default,
                types: pokemon.types.map((t) => t.type.name as PokemonTypeName),
              };
            }),
          );

          set((state) => {
            state.list = items;
            state.offset = PAGE_SIZE;
            state.hasMore = response.next !== null;
            state.isLoading = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Something went wrong";
            state.isLoading = false;
          });
        }
      },

      // fetch next page (infinite scroll)
      fetchNextPage: async () => {
        const { isLoadingMore, hasMore, offset } = get();

        // dont fetch if already loading or no more pages
        if (isLoadingMore || !hasMore) return;

        set((state) => {
          state.isLoadingMore = true;
          state.error = null;
        });

        try {
          const response = await getPokemonList(offset, PAGE_SIZE);

          const items = await Promise.all(
            response.results.map(async (ref: NamedAPIResource) => {
              const pokemon = await getPokemonById(ref.name);
              return {
                id: pokemon.id,
                name: pokemon.name,
                sprite: pokemon.sprites.front_default,
                types: pokemon.types.map((t) => t.type.name as PokemonTypeName),
              };
            })
          );

          set((state) => {
            state.list.push(...items);
            state.offset = offset + PAGE_SIZE;
            state.hasMore = response.next !== null;
            state.isLoadingMore = false;
          });
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Something went wrong";
            state.isLoadingMore = false;
          });
        }
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
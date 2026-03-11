import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { getPokemonList, getPokemonById, getPokemonDetail } from "../../api";
import type {
  NamedAPIResource,
  Pokemon,
  PokemonDetail,
  PokemonTypeName,
} from "../../api";

// item for the list screen - we fetch the full data for each one
// to get the sprite and types (the list endpoint only gives name + url)
export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string | null;
  types: PokemonTypeName[];
}

// state shape
interface PokemonState {
  // list
  list: PokemonListItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;

  // detail cache - so we dont refetch when going back
  detailCache: Record<number, PokemonDetail>;
  isLoadingDetail: boolean;

  // error
  error: string | null;
}

// actions
interface PokemonActions {
  fetchPokemonList: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  fetchPokemonDetail: (id: number) => Promise<void>;
  clearError: () => void;
}

type PokemonStore = PokemonState & PokemonActions;

const PAGE_SIZE = 30;

export const usePokemonStore = create<PokemonStore>()(
  devtools(
    immer((set, get) => ({
      // initial state
      list: [],
      offset: 0,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
      detailCache: {},
      isLoadingDetail: false,
      error: null,

      // fetch first page of pokemon
      fetchPokemonList: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await getPokemonList(0, PAGE_SIZE);

          // fetch details for each pokemon to get sprites and types
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
            state.error =
              error instanceof Error ? error.message : "Something went wrong";
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
            }),
          );

          set((state) => {
            state.list.push(...items);
            state.offset = offset + PAGE_SIZE;
            state.hasMore = response.next !== null;
            state.isLoadingMore = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Something went wrong";
            state.isLoadingMore = false;
          });
        }
      },

      // fetch detail for a single pokemon - uses cache
      fetchPokemonDetail: async (id: number) => {
        // check cache first
        if (get().detailCache[id]) return;

        set((state) => {
          state.isLoadingDetail = true;
          state.error = null;
        });

        try {
          const detail = await getPokemonDetail(id);

          set((state) => {
            state.detailCache[id] = detail;
            state.isLoadingDetail = false;
          });
        } catch (error) {
          set((state) => {
            state.error =
              error instanceof Error ? error.message : "Something went wrong";
            state.isLoadingDetail = false;
          });
        }
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    { name: "pokemon-store" },
  ),
);

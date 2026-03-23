import type { PokemonListRepository, PokemonListItem } from "../repositories/pokemonListRepository";

export const PAGE_SIZE = 30;

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

// receives the repository so we can test it without depending on the real api
export function createPokemonListStore(repository: PokemonListRepository) {
  return (
    set: (fn: (state: PokemonListStore) => void) => void,
    get: () => PokemonListStore,
  ): PokemonListStore => ({
    // initial state
    list: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,

    fetchPokemonList: async () => {
      // set loading to true before the api call
      set((state) => { state.isLoading = true; state.error = null; });
      try {
        const { items, hasMore } = await repository.fetchPage(0, PAGE_SIZE);
        // when it finishes we save the data in the state
        set((state) => {
          state.list = items;
          state.offset = items.length;
          state.hasMore = hasMore;
          state.isLoading = false;
        });
      } catch (e) {
        // if it fails we save the error message
        set((state) => {
          state.error = e instanceof Error ? e.message : "Something went wrong";
          state.isLoading = false;
        });
      }
    },

    fetchNextPage: async () => {
      const { isLoadingMore, hasMore, offset } = get();
      // if its already loading or there are no more pages do nothing
      if (isLoadingMore || !hasMore) return;

      set((state) => { state.isLoadingMore = true; state.error = null; });
      try {
        const { items, hasMore: more } = await repository.fetchPage(offset, PAGE_SIZE);
        set((state) => {
          // add the new ones at the end of the current list
          state.list.push(...items);
          state.offset += items.length;
          state.hasMore = more;
          state.isLoadingMore = false;
        });
      } catch (e) {
        set((state) => {
          state.error = e instanceof Error ? e.message : "Something went wrong";
          state.isLoadingMore = false;
        });
      }
    },

    // resets all the state and fetches again from the beginning
    refreshList: async () => {
      set((state) => {
        state.list = [];
        state.offset = 0;
        state.hasMore = true;
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = null;
      });
      await get().fetchPokemonList();
    },

    clearError: () => {
      set((state) => { state.error = null; });
    },
  });
}

// selectors to use in the hook
export const selectList = (state: PokemonListStore) => state.list;
export const selectOffset = (state: PokemonListStore) => state.offset;
export const selectHasMore = (state: PokemonListStore) => state.hasMore;
export const selectIsLoading = (state: PokemonListStore) => state.isLoading;
export const selectIsLoadingMore = (state: PokemonListStore) => state.isLoadingMore;
export const selectError = (state: PokemonListStore) => state.error;
export const selectFetchPokemonList = (state: PokemonListStore) => state.fetchPokemonList;
export const selectFetchNextPage = (state: PokemonListStore) => state.fetchNextPage;
export const selectRefreshList = (state: PokemonListStore) => state.refreshList;
export const selectClearError = (state: PokemonListStore) => state.clearError;
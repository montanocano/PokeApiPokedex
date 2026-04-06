import { immer } from "zustand/middleware/immer";
import type { PokemonDetail } from "../../../shared/api/Types";
import type { PokemonDetailRepository } from "../repositories/DefaultPokemonDetailRepository";

interface PokemonDetailState {
  detail: PokemonDetail | null;
  isLoading: boolean;
  error: string | null;
}

interface PokemonDetailActions {
  fetchDetail: (id: number | string) => Promise<void>;
  clearDetail: () => void;
}

export type PokemonDetailStore = PokemonDetailState & PokemonDetailActions;

export function createPokemonDetailStore(repository: PokemonDetailRepository) {
  return immer<PokemonDetailStore>((set) => ({
    // initial state
    detail: null,
    isLoading: false,
    error: null,

    fetchDetail: async (id) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });
      try {
        const detail = await repository.getDetail(id);
        set((state) => {
          state.detail = detail;
          state.isLoading = false;
        });
      } catch (e) {
        set((state) => {
          state.error = e instanceof Error ? e.message : "Something went wrong";
          state.isLoading = false;
        });
      }
    },

    clearDetail: () => {
      set((state) => {
        state.detail = null;
        state.isLoading = false;
        state.error = null;
      });
    },
  }));
}

// selectors
export const selectDetail = (state: PokemonDetailStore) => state.detail;
export const selectIsLoading = (state: PokemonDetailStore) => state.isLoading;
export const selectError = (state: PokemonDetailStore) => state.error;
export const selectFetchDetail = (state: PokemonDetailStore) =>
  state.fetchDetail;
export const selectClearDetail = (state: PokemonDetailStore) =>
  state.clearDetail;

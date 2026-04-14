import { immer } from "zustand/middleware/immer";
import type { PokemonListItem } from "../../pokemon-list/repositories/DefaultPokemonRepository";

interface PokemonFavouriteState {
  favourites: PokemonListItem[];
}

interface PokemonFavouriteActions {
  addFavourite: (pokemon: PokemonListItem) => void;
  removeFavourite: (id: number) => void;
  toggleFavourite: (pokemon: PokemonListItem) => void;
}

export type PokemonFavouriteStore = PokemonFavouriteState &
  PokemonFavouriteActions;

export function createPokemonFavouriteStore() {
  return immer<PokemonFavouriteStore>((set) => ({
    favourites: [],

    addFavourite: (pokemon) => {
      set((state) => {
        const alreadyExists = state.favourites.some((f) => f.id === pokemon.id);
        if (!alreadyExists) {
          state.favourites.push(pokemon);
        }
      });
    },

    removeFavourite: (id) => {
      set((state) => {
        state.favourites = state.favourites.filter((f) => f.id !== id);
      });
    },

    toggleFavourite: (pokemon) => {
      set((state) => {
        const idx = state.favourites.findIndex((f) => f.id === pokemon.id);
        if (idx !== -1) {
          state.favourites.splice(idx, 1);
        } else {
          state.favourites.push(pokemon);
        }
      });
    },
  }));
}

// selectors
export const selectFavourites = (state: PokemonFavouriteStore) =>
  state.favourites;
export const selectAddFavourite = (state: PokemonFavouriteStore) =>
  state.addFavourite;
export const selectRemoveFavourite = (state: PokemonFavouriteStore) =>
  state.removeFavourite;
export const selectToggleFavourite = (state: PokemonFavouriteStore) =>
  state.toggleFavourite;

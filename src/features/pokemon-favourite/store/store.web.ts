// Web-specific store: uses localStorage instead of AsyncStorage
// Metro/webpack picks this file automatically on web (platform-specific extension)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createPokemonFavouriteStore } from "./pokemonFavouriteStore";
import type { PokemonFavouriteStore } from "./pokemonFavouriteStore";

export const usePokemonFavouriteStore = create<PokemonFavouriteStore>()(
  persist(createPokemonFavouriteStore(), {
    name: "pokemon-favourites",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ favourites: state.favourites }),
  }),
);

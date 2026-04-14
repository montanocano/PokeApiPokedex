// Native store: uses AsyncStorage for persistence
// On web, Metro/webpack resolves store.web.ts instead of this file
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createPokemonFavouriteStore } from "./pokemonFavouriteStore";
import type { PokemonFavouriteStore } from "./pokemonFavouriteStore";

export const usePokemonFavouriteStore = create<PokemonFavouriteStore>()(
  persist(createPokemonFavouriteStore(), {
    name: "pokemon-favourites",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({ favourites: state.favourites }),
  }),
);

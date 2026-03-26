// here we create the store with the real repository
// in tests we use createPokemonListStore directly with a mock

import { create } from "zustand";
import { createPokemonListStore } from "./pokemonListStore";
import { defaultPokemonListRepository } from "../repositories/pokemonListRepositoryImpl";
import type { PokemonListStore } from "./pokemonListStore";

export const usePokemonListStore = create<PokemonListStore>()(
  createPokemonListStore(defaultPokemonListRepository),
);

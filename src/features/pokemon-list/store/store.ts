// here we create the store with the real repository
// in tests we use createPokemonListStore directly with a mock

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { createPokemonListStore } from "./pokemonListStore";
import { pokemonListRepository } from "../repositories/pokemonListRepositoryImpl";
import type { PokemonListStore } from "./pokemonListStore";

export const usePokemonListStore = create<PokemonListStore>()(
  devtools(
    immer(createPokemonListStore(pokemonListRepository)),
    { name: "pokemon-list-store" },
  ),
);
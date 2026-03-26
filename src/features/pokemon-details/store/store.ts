import { create } from "zustand";
import { createPokemonDetailStore } from "./pokemonDetailStore";
import { defaultPokemonDetailRepository } from "../repositories/pokemonDetailRepositoryImpl";
import type { PokemonDetailStore } from "./pokemonDetailStore";

export const usePokemonDetailStore = create<PokemonDetailStore>()(
  createPokemonDetailStore(defaultPokemonDetailRepository),
);

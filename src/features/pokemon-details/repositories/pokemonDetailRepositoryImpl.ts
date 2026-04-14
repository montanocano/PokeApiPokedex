import { getPokemonDetail } from "../../../shared/api";
import type { PokemonDetailRepository } from "./DefaultPokemonDetailRepository";

export const defaultPokemonDetailRepository: PokemonDetailRepository = {
  getDetail: (id) => getPokemonDetail(id),
};

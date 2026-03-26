import { getPokemonDetail } from "../../../shared/api";
import type { PokemonDetailRepository } from "./defaultpokemonDetailRepository";

export const defaultPokemonDetailRepository: PokemonDetailRepository = {
  getDetail: (id) => getPokemonDetail(id),
};

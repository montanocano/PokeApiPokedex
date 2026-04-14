import type { PokemonDetail } from "../../../shared/api/Types";

export interface PokemonDetailRepository {
  getDetail: (id: number | string) => Promise<PokemonDetail>;
}

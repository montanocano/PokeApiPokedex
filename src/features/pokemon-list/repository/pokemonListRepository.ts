import { getPokemonList, getPokemonById } from "../../../shared/api";
import type { NamedAPIResource, PokemonTypeName } from "../../../shared/api";
import type { PokemonListItem } from "../store/pokemonListStore";
import { PAGE_SIZE } from "../store/pokemonListStore";

interface PageResult {
  items: PokemonListItem[];
  hasMore: boolean;
}

export const pokemonListRepository = {
  async getPage(offset: number): Promise<PageResult> {
    const response = await getPokemonList(offset, PAGE_SIZE);

    const items = await Promise.all(
      response.results.map(async (ref: NamedAPIResource): Promise<PokemonListItem> => {
        const pokemon = await getPokemonById(ref.name);
        return {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map((t) => t.type.name as PokemonTypeName),
        };
      }),
    );

    return { items, hasMore: response.next !== null };
  },
};
import { getPokemonList, getPokemonById } from "../../../shared/api";
import type { NamedAPIResource, PokemonTypeName } from "../../../shared/api";
import type { PokemonListItem } from "../store/pokemonListStore";
import { PAGE_SIZE } from "../store/pokemonListStore";

const MAX_CONCURRENT_DETAIL_REQUESTS = 5;

interface PageResult {
  items: PokemonListItem[];
  hasMore: boolean;
}

async function fetchPokemonListItems(
  results: NamedAPIResource[],
): Promise<PokemonListItem[]> {
  const items: PokemonListItem[] = [];

  for (let i = 0; i < results.length; i += MAX_CONCURRENT_DETAIL_REQUESTS) {
    const batch = results.slice(i, i + MAX_CONCURRENT_DETAIL_REQUESTS);

    const batchItems = await Promise.all(
      batch.map(async (ref: NamedAPIResource): Promise<PokemonListItem> => {
        const pokemon = await getPokemonById(ref.name);
        return {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map((t) => t.type.name as PokemonTypeName),
        };
      }),
    );

    items.push(...batchItems);
  }

  return items;
}

export const pokemonListRepository = {
  async getPage(offset: number): Promise<PageResult> {
    const response = await getPokemonList(offset, PAGE_SIZE);
    const items = await fetchPokemonListItems(response.results);

    return { items, hasMore: response.next !== null };
  },
};

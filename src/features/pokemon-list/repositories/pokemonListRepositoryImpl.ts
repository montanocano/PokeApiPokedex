import {
  getPokemonList,
  getPokemonListItems,
  PAGE_SIZE,
} from "../../../shared/api";
import type {
  PokemonListRepository,
  PokemonPage,
} from "./DefaultPokemonRepository";

// real implementation of the repository that calls the api
export const pokemonListRepository: PokemonListRepository = {
  fetchPage: async (
    offset: number,
    limit: number = PAGE_SIZE,
  ): Promise<PokemonPage> => {
    // fetch the paginated list
    const response = await getPokemonList(offset, limit);
    // with the results we fetch the details of each pokemon
    const items = await getPokemonListItems(response.results);

    return {
      items,
      hasMore: response.next !== null, // if next is null there are no more pages
    };
  },
};

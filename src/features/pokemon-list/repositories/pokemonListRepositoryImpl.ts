import {
  getPokemonList,
  getPokemonListItems,
  extractIdFromUrl,
  PAGE_SIZE,
} from "../../../shared/api";
import type {
  PokemonListRepository,
  PokemonPage,
} from "./DefaultPokemonRepository";

// IDs >= 10001 are special forms (megas, regional, etc.)
const MAX_REGULAR_ID = 10000;

// real implementation of the repository that calls the api
export const defaultPokemonListRepository: PokemonListRepository = {
  fetchPage: async (
    offset: number,
    limit: number = PAGE_SIZE,
  ): Promise<PokemonPage> => {
    // fetch the paginated list
    const response = await getPokemonList(offset, limit);

    // filter out special forms before fetching details
    const regular = response.results.filter(
      (ref) => extractIdFromUrl(ref.url) <= MAX_REGULAR_ID,
    );

    // if we filtered everything out, there are no more regular pokemon
    if (regular.length === 0) {
      return { items: [], hasMore: false };
    }

    // with the filtered results we fetch the details of each pokemon
    const items = await getPokemonListItems(regular);

    // stop paginating if we hit special forms or if the API has no more pages
    const hasMore =
      response.next !== null && regular.length === response.results.length;

    return { items, hasMore };
  },
};

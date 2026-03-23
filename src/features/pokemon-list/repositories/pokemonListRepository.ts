import type { PokemonTypeName } from "../../../shared/api/Types";

// each pokemon in the list has these fields
export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string | null;
  types: PokemonTypeName[];
}

// this is what the repository returns when we fetch a page
export interface PokemonPage {
  items: PokemonListItem[];
  hasMore: boolean;
}

// repository interface, any implementation needs to have fetchPage
export interface PokemonListRepository {
  fetchPage: (offset: number, limit: number) => Promise<PokemonPage>;
}
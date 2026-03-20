import { apiClient } from "./client";
import type { NamedAPIResource, PokemonListResponse, Pokemon, PokemonTypeName, TypeDetailResponse } from "./Types";
import type { PokemonListItem } from "../../features/pokemon-list/store/pokemonListStore";

// service for pokemon list related api calls

const MAX_CONCURRENT = 5;
export const PAGE_SIZE = 30;

// get paginated list of pokemon
// offset = where to start, limit = how many to fetch
export async function getPokemonList(
  offset: number = 0,
  limit: number = PAGE_SIZE,
): Promise<PokemonListResponse> {
  try {
    const data = await apiClient.get<PokemonListResponse>("/pokemon", {
      params: { offset, limit },
    });
    return data;
  } catch (error) {
    console.error("Error getting pokemon list:", error);
    throw error;
  }
}

// get a single pokemon by id
export async function getPokemonById(id: number | string): Promise<Pokemon> {
  try {
    const data = await apiClient.get<Pokemon>(`/pokemon/${id}`);
    return data;
  } catch (error) {
    console.error(`Error getting pokemon ${id}:`, error);
    throw error;
  }
}

// transforms a raw Pokemon api response into a PokemonListItem
function toPokemonListItem(pokemon: Pokemon): PokemonListItem {
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    types: pokemon.types.map((t) => t.type.name as PokemonTypeName),
  };
}

// fetches a batch of pokemon by their name references and transforms them
// batches requests in groups of MAX_CONCURRENT to avoid hitting rate limits
export async function getPokemonListItems(
  results: NamedAPIResource[],
): Promise<PokemonListItem[]> {
  const items: PokemonListItem[] = [];

  for (let i = 0; i < results.length; i += MAX_CONCURRENT) {
    const batch = results.slice(i, i + MAX_CONCURRENT);
    const batchItems = await Promise.all(
      batch.map(async (ref: NamedAPIResource) => {
        const pokemon = await getPokemonById(ref.name);
        return toPokemonListItem(pokemon);
      }),
    );
    items.push(...batchItems);
  }

  return items;
}

// get all pokemon of a specific type
export async function getPokemonByType(
  typeName: PokemonTypeName,
): Promise<TypeDetailResponse> {
  try {
    const data = await apiClient.get<TypeDetailResponse>(`/type/${typeName}`);
    return data;
  } catch (error) {
    console.error(`Error getting pokemon of type ${typeName}:`, error);
    throw error;
  }
}

// helper to extract the id from a pokeapi url
// eg: "https://pokeapi.co/api/v2/pokemon/25/" -> 25
export function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter((p) => p !== "");
  return parseInt(parts[parts.length - 1], 10);
}

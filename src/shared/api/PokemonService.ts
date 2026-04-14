import { apiClient } from "./client";
import { isPokemonTypeName } from "./Types";
import type {
  NamedAPIResource,
  PokemonListResponse,
  Pokemon,
  PokemonTypeName,
  TypeDetailResponse,
} from "./Types";
import type { PokemonListItem } from "../../features/pokemon-list/repositories/DefaultPokemonRepository";

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
  const types = pokemon.types.map((t) => t.type.name).filter(isPokemonTypeName);

  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    types,
  };
}

// fetches pokemon by their name references and transforms them
// uses a concurrency pool so up to MAX_CONCURRENT requests run at all times
// instead of waiting for each batch to finish before starting the next
export async function getPokemonListItems(
  results: NamedAPIResource[],
): Promise<PokemonListItem[]> {
  let running = 0;
  let index = 0;
  const items: (PokemonListItem | null)[] = new Array(results.length).fill(
    null,
  );

  return new Promise((resolve, reject) => {
    function next() {
      while (running < MAX_CONCURRENT && index < results.length) {
        const i = index++;
        running++;
        getPokemonById(results[i].name)
          .then((pokemon) => {
            items[i] = toPokemonListItem(pokemon);
            running--;
            if (index >= results.length && running === 0) {
              resolve(items as PokemonListItem[]);
            } else {
              next();
            }
          })
          .catch(reject);
      }
    }

    if (results.length === 0) {
      resolve([]);
    } else {
      next();
    }
  });
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

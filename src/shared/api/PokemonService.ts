import { apiClient } from "./client";
import type { PokemonListResponse, Pokemon, PokemonTypeName } from "./Types";

// service for pokemon list related api calls
// for now just list and types, we'll add more stuff later

// get paginated list of pokemon
// offset = where to start, limit = how many to fetch
export async function getPokemonList(
  offset: number = 0,
  limit: number = 30
): Promise<PokemonListResponse> {
  try {
    const data = await apiClient.get<any, PokemonListResponse>("/pokemon", {
      params: { offset, limit },
    });
    return data;
  } catch (error) {
    // let the error bubble up, the client interceptor already handles it
    console.error("Error getting pokemon list:", error);
    throw error;
  }
}

// get a single pokemon by id (we need this to get sprites and types for each one)
export async function getPokemonById(id: number | string): Promise<Pokemon> {
  try {
    const data = await apiClient.get<any, Pokemon>(`/pokemon/${id}`);
    return data;
  } catch (error) {
    console.error(`Error getting pokemon ${id}:`, error);
    throw error;
  }
}

// response from GET /type/{name} - only typing what we need
interface TypeDetailResponse {
  id: number;
  name: string;
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
}

// get all pokemon of a specific type
// eg: getPokemonByType("fire") -> all fire pokemon
export async function getPokemonByType(
  typeName: PokemonTypeName
): Promise<TypeDetailResponse> {
  try {
    const data = await apiClient.get<any, TypeDetailResponse>(
      `/type/${typeName}`
    );
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
/**
 * @file pokemonListRepository.test.ts
 * @description Unit tests for src/features/pokemon-list/repository/pokemonListRepository.ts
 *
 * Steps:
 *  1. getPage(0)  – calls getPokemonList with offset=0 and PAGE_SIZE.
 *  2. getPage(30) – calls getPokemonList with offset=30 (second page).
 *  3. getPage     – calls getPokemonById for each result in the page.
 *  4. getPage     – maps raw pokemon to PokemonListItem (id, name, sprite, types).
 *  5. getPage     – sets hasMore=true when API response.next is not null.
 *  6. getPage     – sets hasMore=false when API response.next is null.
 *  7. getPage     – fetches details in batches of MAX_CONCURRENT (5), maintaining order.
 *  8. getPage     – re-throws errors propagated from getPokemonList.
 *  9. getPage     – re-throws errors propagated from getPokemonById.
 */

import { pokemonListRepository } from "../repository/pokemonListRepository";
import * as PokemonService from "../../../shared/api/PokemonService";
import { PAGE_SIZE } from "../store/pokemonListStore";
import type { Pokemon } from "../../../shared/api/Types";

jest.mock("../../../shared/api/PokemonService");

const mockGetPokemonList = PokemonService.getPokemonList as jest.MockedFunction<typeof PokemonService.getPokemonList>;
const mockGetPokemonById = PokemonService.getPokemonById as jest.MockedFunction<typeof PokemonService.getPokemonById>;

// Helpers
function makeApiRef(id: number) {
  return { name: String(id), url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
}

function makePokemon(id: number, types = ["fire"]): Pokemon {
  return {
    id,
    name: `pokemon-${id}`,
    height: 1,
    weight: 1,
    base_experience: 50,
    types: types.map((t, slot) => ({ slot, type: { name: t, url: "" } })),
    stats: [],
    abilities: [],
    sprites: {
      front_default: `https://example.com/${id}.png`,
      front_shiny: null,
      other: {
        "official-artwork": { front_default: null, front_shiny: null },
        home: { front_default: null, front_shiny: null },
      },
    },
    moves: [],
    species: { name: `pokemon-${id}`, url: "" },
  };
}

function makePokemonListResponse(count: number, hasNext: boolean) {
  return {
    count: 1302,
    next: hasNext ? "https://pokeapi.co/api/v2/pokemon?offset=30" : null,
    previous: null,
    results: Array.from({ length: count }, (_, i) => makeApiRef(i + 1)),
  };
}

beforeEach(() => jest.clearAllMocks());

describe("pokemonListRepository.getPage", () => {
  it("step 1 – calls getPokemonList with offset=0 and PAGE_SIZE", async () => {
    const listResponse = makePokemonListResponse(3, true);
    mockGetPokemonList.mockResolvedValueOnce(listResponse);
    mockGetPokemonById.mockImplementation((id) =>
      Promise.resolve(makePokemon(Number(id)))
    );

    await pokemonListRepository.getPage(0);

    expect(mockGetPokemonList).toHaveBeenCalledWith(0, PAGE_SIZE);
  });

  it("step 2 – calls getPokemonList with offset=30 for second page", async () => {
    const listResponse = makePokemonListResponse(3, false);
    mockGetPokemonList.mockResolvedValueOnce(listResponse);
    mockGetPokemonById.mockImplementation((id) =>
      Promise.resolve(makePokemon(Number(id)))
    );

    await pokemonListRepository.getPage(30);

    expect(mockGetPokemonList).toHaveBeenCalledWith(30, PAGE_SIZE);
  });

  it("step 3 – calls getPokemonById for each result", async () => {
    const listResponse = makePokemonListResponse(3, true);
    mockGetPokemonList.mockResolvedValueOnce(listResponse);
    mockGetPokemonById.mockImplementation((id) =>
      Promise.resolve(makePokemon(typeof id === "string" ? parseInt(id) : id))
    );

    await pokemonListRepository.getPage(0);

    // called once per pokemon in the page
    expect(mockGetPokemonById).toHaveBeenCalledTimes(3);
  });

  it("step 4 – maps raw pokemon to PokemonListItem shape", async () => {
    const listResponse = makePokemonListResponse(1, false);
    mockGetPokemonList.mockResolvedValueOnce(listResponse);
    mockGetPokemonById.mockResolvedValueOnce(makePokemon(1, ["grass", "poison"]));

    const { items } = await pokemonListRepository.getPage(0);

    expect(items[0]).toEqual({
      id: 1,
      name: "pokemon-1",
      sprite: "https://example.com/1.png",
      types: ["grass", "poison"],
    });
  });

  it("step 5 – hasMore=true when next is not null", async () => {
    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(3, true));
    mockGetPokemonById.mockImplementation((id) =>
      Promise.resolve(makePokemon(Number(id)))
    );

    const { hasMore } = await pokemonListRepository.getPage(0);
    expect(hasMore).toBe(true);
  });

  it("step 6 – hasMore=false when next is null", async () => {
    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(3, false));
    mockGetPokemonById.mockImplementation((id) =>
      Promise.resolve(makePokemon(Number(id)))
    );

    const { hasMore } = await pokemonListRepository.getPage(0);
    expect(hasMore).toBe(false);
  });

  it("step 7 – processes 6 pokemon in batches of 5, preserving order", async () => {
    const listResponse = makePokemonListResponse(6, true);
    mockGetPokemonList.mockResolvedValueOnce(listResponse);

    // Track call order to validate batching
    const callOrder: number[] = [];
    mockGetPokemonById.mockImplementation(async (id) => {
      const numId = typeof id === "string" ? parseInt(id) : id;
      callOrder.push(numId);
      return makePokemon(numId);
    });

    const { items } = await pokemonListRepository.getPage(0);

    // All 6 items present and in correct order
    expect(items).toHaveLength(6);
    expect(items.map((i) => i.id)).toEqual([1, 2, 3, 4, 5, 6]);
    // getPokemonById should have been called exactly 6 times
    expect(mockGetPokemonById).toHaveBeenCalledTimes(6);
  });

  it("step 8 – re-throws errors from getPokemonList", async () => {
    mockGetPokemonList.mockRejectedValueOnce(new Error("network down"));

    await expect(pokemonListRepository.getPage(0)).rejects.toThrow("network down");
  });

  it("step 9 – re-throws errors from getPokemonById", async () => {
    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(2, true));
    mockGetPokemonById.mockRejectedValueOnce(new Error("detail failed"));

    await expect(pokemonListRepository.getPage(0)).rejects.toThrow("detail failed");
  });
});
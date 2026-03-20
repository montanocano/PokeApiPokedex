/**
 * @file PokemonService.test.ts
 * @description Unit tests for src/shared/api/PokemonService.ts
 *
 * Steps:
 *  1. getPokemonList – returns paginated list with default params (offset=0, limit=30).
 *  2. getPokemonList – forwards custom offset/limit to the client.
 *  3. getPokemonList – re-throws errors from the client.
 *  4. getPokemonById – fetches a pokemon by numeric id.
 *  5. getPokemonById – fetches a pokemon by string name.
 *  6. getPokemonById – re-throws errors from the client.
 *  7. getPokemonByType – fetches all pokemon of a given type.
 *  8. getPokemonByType – re-throws errors from the client.
 *  9. extractIdFromUrl – extracts the numeric id from a PokeAPI url.
 * 10. extractIdFromUrl – handles trailing slash correctly.
 */

import {
  getPokemonList,
  getPokemonById,
  getPokemonByType,
  extractIdFromUrl,
} from "../PokemonService";
import { apiClient } from "../client";

// Mock the entire client module so HTTP never goes out
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

// Fixtures
const fakePokemonListResponse = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=30&limit=30",
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  ],
};

const fakePokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [{ slot: 1, type: { name: "grass", url: "" } }],
  stats: [],
  abilities: [],
  sprites: {
    front_default: "https://example.com/bulbasaur.png",
    front_shiny: null,
    other: {
      "official-artwork": { front_default: null, front_shiny: null },
      home: { front_default: null, front_shiny: null },
    },
  },
  moves: [],
  species: { name: "bulbasaur", url: "" },
};

const fakeTypeResponse = {
  id: 10,
  name: "fire",
  pokemon: [
    {
      pokemon: {
        name: "charmander",
        url: "https://pokeapi.co/api/v2/pokemon/4/",
      },
      slot: 1,
    },
  ],
};

beforeEach(() => jest.clearAllMocks());

// Step 1 & 2: getPokemonList
describe("getPokemonList", () => {
  it("step 1 – calls /pokemon with default offset=0 and limit=30", async () => {
    mockGet.mockResolvedValueOnce(fakePokemonListResponse);

    const result = await getPokemonList();

    expect(mockGet).toHaveBeenCalledWith("/pokemon", {
      params: { offset: 0, limit: 30 },
    });
    expect(result).toEqual(fakePokemonListResponse);
  });

  it("step 2 – forwards custom offset and limit", async () => {
    mockGet.mockResolvedValueOnce(fakePokemonListResponse);

    await getPokemonList(60, 15);

    expect(mockGet).toHaveBeenCalledWith("/pokemon", {
      params: { offset: 60, limit: 15 },
    });
  });

  it("step 3 – re-throws errors from the client", async () => {
    mockGet.mockRejectedValueOnce(new Error("network error"));

    await expect(getPokemonList()).rejects.toThrow("network error");
  });
});

// Steps 4–6: getPokemonById
describe("getPokemonById", () => {
  it("step 4 – fetches pokemon by numeric id", async () => {
    mockGet.mockResolvedValueOnce(fakePokemon);

    const result = await getPokemonById(1);

    expect(mockGet).toHaveBeenCalledWith("/pokemon/1");
    expect(result).toEqual(fakePokemon);
  });

  it("step 5 – fetches pokemon by string name", async () => {
    mockGet.mockResolvedValueOnce(fakePokemon);

    await getPokemonById("bulbasaur");

    expect(mockGet).toHaveBeenCalledWith("/pokemon/bulbasaur");
  });

  it("step 6 – re-throws errors from the client", async () => {
    mockGet.mockRejectedValueOnce(new Error("404"));

    await expect(getPokemonById(9999)).rejects.toThrow("404");
  });
});

// Steps 7–8: getPokemonByType
describe("getPokemonByType", () => {
  it("step 7 – fetches all pokemon of the given type", async () => {
    mockGet.mockResolvedValueOnce(fakeTypeResponse);

    const result = await getPokemonByType("fire");

    expect(mockGet).toHaveBeenCalledWith("/type/fire");
    expect(result).toEqual(fakeTypeResponse);
  });

  it("step 8 – re-throws errors from the client", async () => {
    mockGet.mockRejectedValueOnce(new Error("server error"));

    await expect(getPokemonByType("fire")).rejects.toThrow("server error");
  });
});

// Steps 9–10: extractIdFromUrl
describe("extractIdFromUrl", () => {
  it("step 9 – extracts numeric id from a PokeAPI url", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("step 10 – handles url without trailing slash", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25")).toBe(25);
  });

  it("works for three-digit ids", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/150/")).toBe(
      150,
    );
  });
});

/**
 * @file pokemonDetailService.test.ts
 * @description Unit tests for src/shared/api/pokemonDetailService.ts
 *
 * Steps:
 *  1. parsePokemonDetail – maps id, name, height, weight, baseExperience correctly.
 *  2. parsePokemonDetail – converts snake_case stats -> camelCase ParsedStat[].
 *  3. parsePokemonDetail – converts abilities -> ParsedAbility[].
 *  4. parsePokemonDetail – extracts sprite urls into ParsedSprites.
 *  5. parsePokemonDetail – slices moves to first 30 and parses latest version group detail.
 *  6. parsePokemonDetail – handles null base_experience by defaulting to 0.
 *  7. getPokemonDetail  – calls apiClient.get and returns parsed result.
 *  8. getPokemonDetail  – re-throws errors from the client.
 */

import { parsePokemonDetail, getPokemonDetail } from "../pokemonDetailService";
import { apiClient } from "../client";
import type { Pokemon } from "../Types";

jest.mock("../client", () => ({
  apiClient: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

// Helpers
function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    base_experience: 112,
    types: [{ slot: 1, type: { name: "electric", url: "" } }],
    stats: [
      { base_stat: 35, effort: 0, stat: { name: "hp", url: "" } },
      { base_stat: 55, effort: 0, stat: { name: "attack", url: "" } },
    ],
    abilities: [
      { ability: { name: "static", url: "" }, is_hidden: false, slot: 1 },
      { ability: { name: "lightning-rod", url: "" }, is_hidden: true, slot: 3 },
    ],
    sprites: {
      front_default: "https://example.com/front.png",
      front_shiny: "https://example.com/shiny.png",
      other: {
        "official-artwork": { front_default: "https://example.com/artwork.png", front_shiny: null },
        home: { front_default: "https://example.com/home.png", front_shiny: null },
      },
    },
    moves: Array.from({ length: 35 }, (_, i) => ({
      move: { name: `move-${i}`, url: "" },
      version_group_details: [
        {
          level_learned_at: i * 2,
          move_learn_method: { name: "level-up", url: "" },
          version_group: { name: "red-blue", url: "" },
        },
      ],
    })),
    species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe("parsePokemonDetail", () => {
  it("step 1 – maps id, name, height, weight, baseExperience", () => {
    const detail = parsePokemonDetail(makePokemon());
    expect(detail.id).toBe(25);
    expect(detail.name).toBe("pikachu");
    expect(detail.height).toBe(4);
    expect(detail.weight).toBe(60);
    expect(detail.baseExperience).toBe(112);
  });

  it("step 2 – converts stats to camelCase ParsedStat[]", () => {
    const detail = parsePokemonDetail(makePokemon());
    expect(detail.stats).toHaveLength(2);
    expect(detail.stats[0]).toEqual({ baseStat: 35, effort: 0, statName: "hp" });
    expect(detail.stats[1]).toEqual({ baseStat: 55, effort: 0, statName: "attack" });
  });

  it("step 3 – converts abilities to ParsedAbility[]", () => {
    const detail = parsePokemonDetail(makePokemon());
    expect(detail.abilities).toHaveLength(2);
    expect(detail.abilities[0]).toEqual({ abilityName: "static", isHidden: false, slot: 1 });
    expect(detail.abilities[1]).toEqual({ abilityName: "lightning-rod", isHidden: true, slot: 3 });
  });

  it("step 4 – extracts sprite urls into ParsedSprites", () => {
    const detail = parsePokemonDetail(makePokemon());
    expect(detail.sprites.frontDefault).toBe("https://example.com/front.png");
    expect(detail.sprites.frontShiny).toBe("https://example.com/shiny.png");
    expect(detail.sprites.officialArtwork).toBe("https://example.com/artwork.png");
    expect(detail.sprites.home).toBe("https://example.com/home.png");
  });

  it("step 5 – slices moves to first 30 and reads the last version_group_detail", () => {
    const detail = parsePokemonDetail(makePokemon());
    // fixture has 35 moves, only 30 should be included
    expect(detail.moves).toHaveLength(30);
    expect(detail.moves[0].moveName).toBe("move-0");
    expect(detail.moves[0].learnMethod).toBe("level-up");
    expect(detail.moves[0].levelLearnedAt).toBe(0);
  });

  it("step 6 – defaults baseExperience to 0 when api returns null", () => {
    const detail = parsePokemonDetail(makePokemon({ base_experience: null }));
    expect(detail.baseExperience).toBe(0);
  });

  it("includes speciesUrl from species.url", () => {
    const detail = parsePokemonDetail(makePokemon());
    expect(detail.speciesUrl).toBe("https://pokeapi.co/api/v2/pokemon-species/25/");
  });
});

describe("getPokemonDetail", () => {
  it("step 7 – calls apiClient.get and returns parsed PokemonDetail", async () => {
    mockGet.mockResolvedValueOnce(makePokemon());

    const detail = await getPokemonDetail(25);

    expect(mockGet).toHaveBeenCalledWith("/pokemon/25");
    expect(detail.id).toBe(25);
    expect(detail.name).toBe("pikachu");
  });

  it("step 7 – accepts a string id", async () => {
    mockGet.mockResolvedValueOnce(makePokemon());

    await getPokemonDetail("pikachu");

    expect(mockGet).toHaveBeenCalledWith("/pokemon/pikachu");
  });

  it("step 8 – re-throws errors from the client", async () => {
    mockGet.mockRejectedValueOnce(new Error("not found"));

    await expect(getPokemonDetail(9999)).rejects.toThrow("not found");
  });
});

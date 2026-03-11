import { apiClient } from "./client";
import type { Pokemon, PokemonDetail, ParsedStat, ParsedAbility, ParsedSprites, ParsedMove } from "./Types";

// service for the pokemon detail screen
// fetches the raw data and parses it into camelCase so the UI doesnt have to deal with snake_case

// parse the stats array from the api response
function parseStats(raw: Pokemon): ParsedStat[] {
  return raw.stats.map((s) => ({
    baseStat: s.base_stat,
    effort: s.effort,
    statName: s.stat.name,
  }));
}

// parse abilities
function parseAbilities(raw: Pokemon): ParsedAbility[] {
  return raw.abilities.map((a) => ({
    abilityName: a.ability.name,
    isHidden: a.is_hidden,
    slot: a.slot,
  }));
}

// grab the sprite urls we care about
function parseSprites(raw: Pokemon): ParsedSprites {
  return {
    frontDefault: raw.sprites.front_default,
    frontShiny: raw.sprites.front_shiny,
    officialArtwork: raw.sprites.other["official-artwork"].front_default,
    home: raw.sprites.other.home.front_default,
  };
}

// parse moves - we only keep the first 20 to not make things too heavy
function parseMoves(raw: Pokemon): ParsedMove[] {
  return raw.moves.slice(0, 20).map((m) => {
    // get the most recent version group detail (last one in the array)
    const detail = m.version_group_details[m.version_group_details.length - 1];
    return {
      moveName: m.move.name,
      levelLearnedAt: detail?.level_learned_at ?? 0,
      learnMethod: detail?.move_learn_method.name ?? "unknown",
    };
  });
}

// takes the raw api response and transforms everything to camelCase
function parsePokemonDetail(raw: Pokemon): PokemonDetail {
  return {
    id: raw.id,
    name: raw.name,
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience ?? 0,
    types: raw.types.map((t) => t.type.name) as PokemonDetail["types"],
    stats: parseStats(raw),
    abilities: parseAbilities(raw),
    sprites: parseSprites(raw),
    moves: parseMoves(raw),
    speciesUrl: raw.species.url,
  };
}

// fetch pokemon detail by id and return parsed data ready for the UI
export async function getPokemonDetail(id: number | string): Promise<PokemonDetail> {
  try {
    const raw = await apiClient.get<Pokemon>(`/pokemon/${id}`);
    return parsePokemonDetail(raw);
  } catch (error) {
    console.error(`Error getting pokemon detail for ${id}:`, error);
    throw error;
  }
}

// we also export the parser in case we want to use it separately (like in tests)
export { parsePokemonDetail };
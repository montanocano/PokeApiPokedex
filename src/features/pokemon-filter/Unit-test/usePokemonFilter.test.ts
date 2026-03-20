import { act, renderHook } from "@testing-library/react-native";
import { usePokemonFilter } from "../hooks/usePokemonFilter";
import { usePokemonFilterStore } from "../store/pokemonFilterStore";
import type { PokemonListItem } from "../../pokemon-list/store/pokemonListStore";

// Fixtures

const mockPokemon: PokemonListItem[] = [
  { id: 1, name: "bulbasaur", sprite: null, types: ["grass", "poison"] },
  { id: 4, name: "charmander", sprite: null, types: ["fire"] },
  { id: 7, name: "squirtle", sprite: null, types: ["water"] },
  { id: 25, name: "pikachu", sprite: null, types: ["electric"] },
  { id: 6, name: "charizard", sprite: null, types: ["fire", "flying"] },
  { id: 249, name: "lugia", sprite: null, types: ["psychic", "flying"] },
];

// Reset store state before each test
beforeEach(() => {
  usePokemonFilterStore.setState({
    searchQuery: "",
    activeTypes: [],
    activeGenerations: [],
    filteredList: [],
    activeFilterCount: 0,
  });
});

// Search by name

describe("handleSearchChange", () => {
  it("filters by partial name (case-insensitive)", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleSearchChange("char"));

    expect(result.current.filteredList.map((p) => p.name)).toEqual([
      "charmander",
      "charizard",
    ]);
  });

  it("filters by exact number", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleSearchChange("25"));

    expect(result.current.filteredList).toHaveLength(1);
    expect(result.current.filteredList[0].name).toBe("pikachu");
  });

  it("returns full list when query is cleared", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleSearchChange("char"));
    act(() => result.current.handleSearchChange(""));

    expect(result.current.filteredList).toHaveLength(mockPokemon.length);
  });
});

// Apply filter

describe("handleApplyFilter — types", () => {
  it("filters by a single type", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ types: ["fire"] }));

    expect(result.current.filteredList.map((p) => p.name)).toEqual([
      "charmander",
      "charizard",
    ]);
  });

  it("filters by two types (AND logic — dual-typed only)", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ types: ["fire", "flying"] }));

    expect(result.current.filteredList).toHaveLength(1);
    expect(result.current.filteredList[0].name).toBe("charizard");
  });

  it("increments activeFilterCount when a type is selected", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ types: ["water"] }));

    expect(result.current.activeFilterCount).toBe(1);
  });
});

describe("handleApplyFilter — generations", () => {
  it("filters by generation I (ids 1–151)", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ generations: [1] }));

    // lugia (id 249) is gen II — should be excluded
    expect(result.current.filteredList.every((p) => p.id <= 151)).toBe(true);
  });

  it("filters by multiple generations (OR logic)", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ generations: [1, 2] }));

    expect(result.current.filteredList.map((p) => p.name)).toContain("lugia");
  });
});

// Combined filter logic

describe("combined filters", () => {
  it("applies name search AND type filter together", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ types: ["fire"] }));
    act(() => result.current.handleSearchChange("char"));

    expect(result.current.filteredList.map((p) => p.name)).toEqual([
      "charmander",
      "charizard",
    ]);
  });

  it("returns empty list when no pokemon matches combined criteria", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() =>
      result.current.handleApplyFilter({ types: ["fire"], generations: [2] }),
    );

    expect(result.current.filteredList).toHaveLength(0);
  });
});

// Clear filters

describe("handleClearFilters", () => {
  it("resets all criteria and restores the full list", () => {
    const { result } = renderHook(() => usePokemonFilter(mockPokemon));

    act(() => result.current.handleApplyFilter({ types: ["fire"] }));
    act(() => result.current.handleSearchChange("char"));
    act(() => result.current.handleClearFilters());

    expect(result.current.searchQuery).toBe("");
    expect(result.current.activeTypes).toHaveLength(0);
    expect(result.current.activeGenerations).toHaveLength(0);
    expect(result.current.filteredList).toHaveLength(mockPokemon.length);
    expect(result.current.activeFilterCount).toBe(0);
  });
});

// tests for the useSearchFilter hook
// we use a mock store and fake timers so we can control debounce behavior

import { renderHook } from "@testing-library/react-native";
import { act } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useSearchFilter } from "../hooks/useSearchFilter";
import {
  createSearchFilterStore,
  type SearchFilterStore,
} from "../store/searchFilterStore";
import type { PokemonListItem } from "../../repositories/DefaultPokemonRepository";

jest.useFakeTimers();

let mockTestStore: StoreApi<SearchFilterStore>;

// replace the store module so the hook uses our test store
jest.mock("../store/store", () => ({
  useSearchFilterStore: (selector: (state: SearchFilterStore) => unknown) =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("zustand").useStore(mockTestStore, selector),
}));

// helpers
function makeItem(
  id: number,
  name: string,
  types: PokemonListItem["types"] = ["normal"],
): PokemonListItem {
  return { id, name, sprite: null, types };
}

const sampleList: PokemonListItem[] = [
  makeItem(1, "bulbasaur", ["grass", "poison"]),
  makeItem(4, "charmander", ["fire"]),
  makeItem(7, "squirtle", ["water"]),
  makeItem(25, "pikachu", ["electric"]),
];

function resetStore() {
  mockTestStore = createStore(createSearchFilterStore());
}

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("useSearchFilter", () => {
  it("step 1 - starts with empty inputValue and returns the full list", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    expect(result.current.inputValue).toBe("");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedTypes).toEqual([]);
    expect(result.current.filteredList).toEqual(sampleList);
  });

  it("step 2 - handleSearchChange updates inputValue immediately but debounces the store", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleSearchChange("char");
    });

    expect(result.current.inputValue).toBe("char");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.filteredList).toEqual(sampleList);
  });

  it("step 3 - after 300ms the store updates and the list is filtered by name (case insensitive)", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleSearchChange("CHAR");
      jest.runAllTimers();
    });

    expect(result.current.searchQuery).toBe("CHAR");
    expect(result.current.filteredList).toEqual([
      makeItem(4, "charmander", ["fire"]),
    ]);
  });

  it("step 4 - rapid typing only triggers one store update (last value wins)", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleSearchChange("c");
      result.current.handleSearchChange("ch");
      result.current.handleSearchChange("cha");
      result.current.handleSearchChange("char");
      jest.runAllTimers();
    });

    expect(result.current.searchQuery).toBe("char");
  });

  it("step 5 - handleTypeToggle adds a type to the filter", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleTypeToggle("fire");
    });

    expect(result.current.selectedTypes).toEqual(["fire"]);
    expect(result.current.filteredList).toEqual([
      makeItem(4, "charmander", ["fire"]),
    ]);
  });

  it("step 6 - handleTypeToggle supports multiple types simultaneously (AND logic — pokemon must have all selected types)", async () => {
    const listWithDualType = [
      ...sampleList,
      makeItem(6, "charizard", ["fire", "flying"]),
    ];

    const { result } = renderHook(() =>
      useSearchFilter({ list: listWithDualType }),
    );

    await act(async () => {
      result.current.handleTypeToggle("fire");
      result.current.handleTypeToggle("flying");
    });

    expect(result.current.selectedTypes).toEqual(["fire", "flying"]);
    expect(result.current.filteredList).toEqual([
      makeItem(6, "charizard", ["fire", "flying"]),
    ]);
  });

  it("step 7 - handleTypeToggle pressing the same type removes it from the selection", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleTypeToggle("fire");
      result.current.handleTypeToggle("water");
    });
    expect(result.current.selectedTypes).toEqual(["fire", "water"]);

    await act(async () => {
      result.current.handleTypeToggle("fire");
    });
    expect(result.current.selectedTypes).toEqual(["water"]);
    expect(result.current.filteredList).toEqual([
      makeItem(7, "squirtle", ["water"]),
    ]);
  });

  it("step 8 - combined name + type filter (AND logic between name and types)", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleTypeToggle("grass");
      result.current.handleSearchChange("bulb");
      jest.runAllTimers();
    });

    expect(result.current.filteredList).toEqual([
      makeItem(1, "bulbasaur", ["grass", "poison"]),
    ]);
  });

  it("step 9 - combined filter returns empty when name matches but type does not", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleTypeToggle("water");
      result.current.handleSearchChange("char");
      jest.runAllTimers();
    });

    expect(result.current.filteredList).toEqual([]);
  });

  it("step 10 - handleClearFilters resets query, selectedTypes and inputValue", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleTypeToggle("fire");
      result.current.handleTypeToggle("water");
      result.current.handleSearchChange("char");
      jest.runAllTimers();
    });

    await act(async () => {
      result.current.handleClearFilters();
    });

    expect(result.current.inputValue).toBe("");
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedTypes).toEqual([]);
    expect(result.current.filteredList).toEqual(sampleList);
  });

  it("step 11 - handleClearFilters cancels a pending debounce", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleSearchChange("char");
    });

    expect(result.current.inputValue).toBe("char");
    expect(result.current.searchQuery).toBe("");

    await act(async () => {
      result.current.handleClearFilters();
      jest.runAllTimers();
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.inputValue).toBe("");
    expect(result.current.filteredList).toEqual(sampleList);
  });

  it("step 12 - handleGenerationChange filters by generation range", async () => {
    const gen1List = [
      makeItem(1, "bulbasaur", ["grass", "poison"]),
      makeItem(151, "mew", ["psychic"]),
      makeItem(152, "chikorita", ["grass"]),
    ];

    const { result } = renderHook(() => useSearchFilter({ list: gen1List }));

    await act(async () => {
      result.current.handleGenerationChange(1);
    });

    expect(result.current.selectedGeneration).toBe(1);
    expect(result.current.filteredList).toEqual([
      makeItem(1, "bulbasaur", ["grass", "poison"]),
      makeItem(151, "mew", ["psychic"]),
    ]);
  });

  it("step 13 - handleGenerationChange called with the same gen deselects it", async () => {
    const { result } = renderHook(() => useSearchFilter({ list: sampleList }));

    await act(async () => {
      result.current.handleGenerationChange(1);
    });
    expect(result.current.selectedGeneration).toBe(1);

    await act(async () => {
      result.current.handleGenerationChange(1);
    });
    expect(result.current.selectedGeneration).toBeNull();
    expect(result.current.filteredList).toEqual(sampleList);
  });
});

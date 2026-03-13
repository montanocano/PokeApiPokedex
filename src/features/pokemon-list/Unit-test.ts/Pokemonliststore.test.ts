/**
 * @file pokemonListStore.test.ts
 * @description Unit tests for src/features/pokemon-list/store/pokemonListStore.ts
 *
 * Steps:
 *  1. Initial state – list, offset, hasMore, isLoading, isLoadingMore, error defaults.
 *  2. setList     – replaces list, updates offset to items.length, sets hasMore.
 *  3. appendList  – appends items to existing list, increments offset, sets hasMore.
 *  4. setLoading  – toggles isLoading flag.
 *  5. setLoadingMore – toggles isLoadingMore flag.
 *  6. setError    – stores error message string.
 *  7. clearError  – resets error to null.
 *  8. Multiple actions – setList then appendList results in correct combined state.
 */

import { act } from "react-test-renderer";
import { usePokemonListStore, PAGE_SIZE, PokemonListItem } from "../store/pokemonListStore";

// Helpers
function makeItem(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["fire"] };
}

function getStore() {
  return usePokemonListStore.getState();
}

// Reset store between tests
beforeEach(() => {
  usePokemonListStore.setState({
    list: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,
  });
});

// Tests

describe("pokemonListStore", () => {
  it("step 1 – initial state has correct defaults", () => {
    const state = getStore();
    expect(state.list).toEqual([]);
    expect(state.offset).toBe(0);
    expect(state.hasMore).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.isLoadingMore).toBe(false);
    expect(state.error).toBeNull();
  });

  it("step 2 – setList replaces list, sets offset and hasMore", () => {
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    act(() => getStore().setList(items, true));

    const state = getStore();
    expect(state.list).toEqual(items);
    expect(state.offset).toBe(3);
    expect(state.hasMore).toBe(true);
  });

  it("step 2 – setList with hasMore=false", () => {
    act(() => getStore().setList([makeItem(1)], false));
    expect(getStore().hasMore).toBe(false);
  });

  it("step 3 – appendList adds items and increments offset", () => {
    const first = [makeItem(1), makeItem(2)];
    act(() => getStore().setList(first, true));

    const second = [makeItem(3), makeItem(4)];
    act(() => getStore().appendList(second, false));

    const state = getStore();
    expect(state.list).toHaveLength(4);
    expect(state.list[2]).toEqual(makeItem(3));
    expect(state.offset).toBe(4); // 2 from setList + 2 from appendList
    expect(state.hasMore).toBe(false);
  });

  it("step 4 – setLoading toggles isLoading", () => {
    act(() => getStore().setLoading(true));
    expect(getStore().isLoading).toBe(true);

    act(() => getStore().setLoading(false));
    expect(getStore().isLoading).toBe(false);
  });

  it("step 5 – setLoadingMore toggles isLoadingMore", () => {
    act(() => getStore().setLoadingMore(true));
    expect(getStore().isLoadingMore).toBe(true);

    act(() => getStore().setLoadingMore(false));
    expect(getStore().isLoadingMore).toBe(false);
  });

  it("step 6 – setError stores the error message", () => {
    act(() => getStore().setError("Something went wrong"));
    expect(getStore().error).toBe("Something went wrong");
  });

  it("step 7 – clearError resets error to null", () => {
    act(() => getStore().setError("oops"));
    act(() => getStore().clearError());
    expect(getStore().error).toBeNull();
  });

  it("step 8 – setList then appendList yields correct combined state", () => {
    const page1 = Array.from({ length: PAGE_SIZE }, (_, i) => makeItem(i + 1));
    act(() => getStore().setList(page1, true));

    const page2 = Array.from({ length: 5 }, (_, i) => makeItem(PAGE_SIZE + i + 1));
    act(() => getStore().appendList(page2, false));

    const state = getStore();
    expect(state.list).toHaveLength(PAGE_SIZE + 5);
    expect(state.offset).toBe(PAGE_SIZE + 5);
    expect(state.hasMore).toBe(false);
  });

  it("PAGE_SIZE constant is 30", () => {
    expect(PAGE_SIZE).toBe(30);
  });
});
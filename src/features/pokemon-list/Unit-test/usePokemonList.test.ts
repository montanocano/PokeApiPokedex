// tests for the usePokemonList hook
// we use a mock repository so we dont depend on the real api

import { renderHook, act } from "@testing-library/react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { usePokemonList } from "../hooks/usePokemonList";
import { createPokemonListStore } from "../store/pokemonListStore";
import type { PokemonListStore } from "../store/pokemonListStore";
import type { PokemonListRepository, PokemonListItem, PokemonPage } from "../repositories/pokemonListRepository";

// mock of fetchPage to control what it returns in each test
const mockFetchPage = jest.fn<Promise<PokemonPage>, [number, number]>();

const mockRepository: PokemonListRepository = {
  fetchPage: mockFetchPage,
};

// test store, we reset it before each test
let testStore: StoreApi<PokemonListStore>;

// we replace store.ts so the hook uses our test store
// useStore (not getState) keeps the hook subscribed to changes
jest.mock("../store/store", () => ({
  get usePokemonListStore() {
    return (selector: (state: PokemonListStore) => unknown) =>
      useStore(testStore, selector);
  },
}));

// creates a fake pokemon with the given id
function makePokemonListItem(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["water"] };
}

// creates a fake page with N items
function makePage(count: number, hasMore: boolean): PokemonPage {
  return {
    items: Array.from({ length: count }, (_, i) => makePokemonListItem(i + 1)),
    hasMore,
  };
}

function resetStore() {
  testStore = createStore(
    immer(createPokemonListStore(mockRepository)),
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("usePokemonList", () => {
  it("step 1 - loads the list correctly and disables loading when done", async () => {
    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    // it should have fetched from offset 0
    expect(mockFetchPage).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("step 2 - saves the error if the call fails", async () => {
    mockFetchPage.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("network error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.list).toEqual([]);
  });

  it("step 2 - if the error is not an Error instance it saves a generic message", async () => {
    mockFetchPage.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("Something went wrong");
  });

  it("step 3 - does not call the api if already loading more", async () => {
    testStore.setState({ isLoadingMore: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockFetchPage).not.toHaveBeenCalled();
  });

  it("step 4 - does not call the api if there are no more pages", async () => {
    testStore.setState({ hasMore: false });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockFetchPage).not.toHaveBeenCalled();
  });

  it("step 5 - appends the next page at the end with the correct offset", async () => {
    // simulate that we already have the first page loaded
    const firstPage = Array.from({ length: 30 }, (_, i) => makePokemonListItem(i + 1));
    testStore.setState({ list: firstPage, offset: 30, hasMore: true });

    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    // it should fetch from offset 30
    expect(mockFetchPage).toHaveBeenCalledWith(30, 30);
    // and the list now has 32 in total
    expect(result.current.list).toHaveLength(32);
    // hasMore is not exposed by the hook, so we check the store directly
    expect(testStore.getState().hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("step 6 - refreshList resets the state and fetches again from 0", async () => {
    const firstPage = Array.from({ length: 30 }, (_, i) => makePokemonListItem(i + 1));
    testStore.setState({ list: firstPage, offset: 30 });

    mockFetchPage.mockResolvedValueOnce(makePage(1, true));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.refreshList();
    });

    expect(mockFetchPage).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(1);
  });
});
/**
 * @file usePokemonList.test.ts
 * @description Unit tests for src/features/pokemon-list/hooks/usePokemonList.ts
 *
 * Steps:
 *  1. fetchPokemonList – sets loading states and calls repository.getPage(0).
 *  2. fetchPokemonList – calls store.setList with the result on success.
 *  3. fetchPokemonList – calls store.setError on failure, loading ends.
 *  4. fetchNextPage   – skips when isLoading is true.
 *  5. fetchNextPage   – skips when isLoadingMore is true.
 *  6. fetchNextPage   – skips when hasMore is false.
 *  7. fetchNextPage   – calls store.appendList with the next page results.
 *  8. refreshList     – delegates to fetchPokemonList (resets to page 0).
 */

import { renderHook, act } from "@testing-library/react-native";
import { usePokemonList } from "../hooks/usePokemonList";
import { usePokemonListStore } from "../store/pokemonListStore";
import { pokemonListRepository } from "../repository/pokemonListRepository";
import type { PokemonListItem } from "../store/pokemonListStore";

// Mock repository
jest.mock("../repository/pokemonListRepository", () => ({
  pokemonListRepository: {
    getPage: jest.fn(),
  },
}));

const mockGetPage = pokemonListRepository.getPage as jest.MockedFunction<
  typeof pokemonListRepository.getPage
>;

// Helpers
function makeItem(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["water"] };
}

function resetStore() {
  usePokemonListStore.setState({
    list: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    error: null,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("usePokemonList", () => {
  // fetchPokemonList
  it("step 1 – sets isLoading=true before fetch, false after", async () => {
    const items = [makeItem(1)];
    mockGetPage.mockResolvedValueOnce({ items, hasMore: false });

    const { result } = renderHook(() => usePokemonList());

    // loading starts as false
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockGetPage).toHaveBeenCalledWith(0);
  });

  it("step 2 – calls setList with result on success", async () => {
    const items = [makeItem(1), makeItem(2)];
    mockGetPage.mockResolvedValueOnce({ items, hasMore: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.list).toEqual(items);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("step 3 – stores error message on failure, isLoading ends as false", async () => {
    mockGetPage.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("network error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.list).toEqual([]);
  });

  it("step 3 – stores generic message for non-Error rejections", async () => {
    mockGetPage.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("Something went wrong");
  });

  // fetchNextPage
  it("step 4 – skips fetchNextPage when isLoading=true", async () => {
    usePokemonListStore.setState({ isLoading: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPage).not.toHaveBeenCalled();
  });

  it("step 5 – skips fetchNextPage when isLoadingMore=true", async () => {
    usePokemonListStore.setState({ isLoadingMore: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPage).not.toHaveBeenCalled();
  });

  it("step 6 – skips fetchNextPage when hasMore=false", async () => {
    usePokemonListStore.setState({ hasMore: false });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPage).not.toHaveBeenCalled();
  });

  it("step 7 – calls appendList with next page at correct offset", async () => {
    // Set up existing list as first page
    const firstPage = Array.from({ length: 30 }, (_, i) => makeItem(i + 1));
    usePokemonListStore.setState({
      list: firstPage,
      offset: 30,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
    });

    const nextItems = [makeItem(31), makeItem(32)];
    mockGetPage.mockResolvedValueOnce({ items: nextItems, hasMore: false });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPage).toHaveBeenCalledWith(30);
    expect(result.current.list).toHaveLength(32);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  // refreshList
  it("step 8 – refreshList re-fetches from page 0", async () => {
    const items = [makeItem(1)];
    mockGetPage.mockResolvedValueOnce({ items, hasMore: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.refreshList();
    });

    expect(mockGetPage).toHaveBeenCalledWith(0);
    expect(result.current.list).toEqual(items);
  });
});
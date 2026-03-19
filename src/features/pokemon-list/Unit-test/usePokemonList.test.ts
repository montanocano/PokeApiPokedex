/**
 * @file usePokemonList.test.ts
 * @description Unit tests for src/features/pokemon-list/hooks/usePokemonList.ts
 *
 * Steps:
 *  1. fetchPokemonList – sets loading states and populates list on success.
 *  2. fetchPokemonList – stores error message on failure, loading ends.
 *  3. fetchNextPage   – skips when isLoadingMore is true.
 *  4. fetchNextPage   – skips when hasMore is false.
 *  5. fetchNextPage   – appends next page at correct offset.
 *  6. refreshList     – resets and re-fetches from page 0.
 */

import { renderHook, act } from "@testing-library/react-native";
import { usePokemonList } from "../hooks/usePokemonList";
import { usePokemonListStore } from "../store/pokemonListStore";
import type { PokemonListItem } from "../store/pokemonListStore";
import type { Pokemon } from "../../../shared/api";

jest.mock("../../../shared/api", () => ({
  getPokemonList: jest.fn(),
  getPokemonById: jest.fn(),
}));

import { getPokemonList, getPokemonById } from "../../../shared/api";

const mockGetPokemonList = getPokemonList as jest.MockedFunction<typeof getPokemonList>;
const mockGetPokemonById = getPokemonById as jest.MockedFunction<typeof getPokemonById>;

// helpers
function makePokemonListItem(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["water"] };
}

function makePokemonResponse(id: number): Pokemon {
  return {
    id,
    name: `pokemon-${id}`,
    sprites: { front_default: null },
    types: [{ type: { name: "water" } }],
  } as unknown as Pokemon;
}

function makePokemonListResponse(count: number, hasMore: boolean) {
  return {
    results: Array.from({ length: count }, (_, i) => ({
      name: `pokemon-${i + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    })),
    next: hasMore ? "https://pokeapi.co/api/v2/pokemon?offset=30" : null,
    previous: null,
    count: 1000,
  };
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
  it("step 1 – sets isLoading=true before fetch, populates list on success", async () => {
    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(2, false));
    mockGetPokemonById
      .mockResolvedValueOnce(makePokemonResponse(1))
      .mockResolvedValueOnce(makePokemonResponse(2));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(mockGetPokemonList).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("step 2 – stores error message on failure, isLoading ends as false", async () => {
    mockGetPokemonList.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("network error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.list).toEqual([]);
  });

  it("step 2 – stores generic message for non-Error rejections", async () => {
    mockGetPokemonList.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchPokemonList();
    });

    expect(result.current.error).toBe("Something went wrong");
  });

  it("step 3 – skips fetchNextPage when isLoadingMore=true", async () => {
    usePokemonListStore.setState({ isLoadingMore: true });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPokemonList).not.toHaveBeenCalled();
  });

  it("step 4 – skips fetchNextPage when hasMore=false", async () => {
    usePokemonListStore.setState({ hasMore: false });

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPokemonList).not.toHaveBeenCalled();
  });

  it("step 5 – appends next page at correct offset", async () => {
    const firstPage = Array.from({ length: 30 }, (_, i) => makePokemonListItem(i + 1));
    usePokemonListStore.setState({
      list: firstPage,
      offset: 30,
      hasMore: true,
      isLoading: false,
      isLoadingMore: false,
    });

    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(2, false));
    mockGetPokemonById
      .mockResolvedValueOnce(makePokemonResponse(31))
      .mockResolvedValueOnce(makePokemonResponse(32));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(mockGetPokemonList).toHaveBeenCalledWith(30, 30);
    expect(result.current.list).toHaveLength(32);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("step 6 – refreshList resets and re-fetches from page 0", async () => {
    const firstPage = Array.from({ length: 30 }, (_, i) => makePokemonListItem(i + 1));
    usePokemonListStore.setState({ list: firstPage, offset: 30 });

    mockGetPokemonList.mockResolvedValueOnce(makePokemonListResponse(1, true));
    mockGetPokemonById.mockResolvedValueOnce(makePokemonResponse(1));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {
      await result.current.refreshList();
    });

    expect(mockGetPokemonList).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(1);
  });
});
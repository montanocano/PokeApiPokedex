// tests for the usePokemonList hook
// we use a mock repository so we dont depend on the real api

import { renderHook, act } from "@testing-library/react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { usePokemonList } from "../hooks/usePokemonList";
import { createPokemonListStore } from "../store/pokemonListStore";
import type { PokemonListStore } from "../store/pokemonListStore";
import type {
  PokemonListRepository,
  PokemonListItem,
  PokemonPage,
} from "../repositories/DefaultPokemonRepository";
import { useStore } from "zustand";

// mock of fetchPage to control what it returns in each test
const mockFetchPage = jest.fn<Promise<PokemonPage>, [number, number]>();

const mockRepository: PokemonListRepository = {
  fetchPage: mockFetchPage,
};

// test store, we reset it before each test
// prefixed with "mock" so jest.mock() can reference it
let mockTestStore: StoreApi<PokemonListStore>;

// we replace store.ts so the hook uses our test store
jest.mock("../store/store", () => ({
  usePokemonListStore: (selector: (state: PokemonListStore) => unknown) =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("zustand").useStore(mockTestStore, selector),
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
  mockTestStore = createStore(createPokemonListStore(mockRepository));
}

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("usePokemonList", () => {
  it("step 1 - loads the list on mount and disables loading when done", async () => {
    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    const { result } = renderHook(() => usePokemonList());

    // the useEffect calls fetchPokemonList on mount
    await act(async () => {});

    expect(mockFetchPage).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("step 2 - saves the error if the initial load fails", async () => {
    mockFetchPage.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {});

    expect(result.current.error).toBe("network error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.list).toEqual([]);
  });

  it("step 2 - if the error is not an Error instance it saves a generic message", async () => {
    mockFetchPage.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonList());

    await act(async () => {});

    expect(result.current.error).toBe("Something went wrong");
  });

  it("step 3 - handleEndReached does not fetch if already loading more", async () => {
    mockFetchPage.mockResolvedValueOnce(makePage(0, true));

    const { result } = renderHook(() => usePokemonList());
    await act(async () => {});

    // set isLoadingMore via store
    act(() => {
      mockTestStore.setState({ isLoadingMore: true });
    });

    mockFetchPage.mockClear();

    await act(async () => {
      result.current.handleEndReached();
    });

    expect(mockFetchPage).not.toHaveBeenCalled();
  });

  it("step 4 - handleEndReached does not fetch if there are no more pages", async () => {
    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    const { result } = renderHook(() => usePokemonList());
    await act(async () => {});

    mockFetchPage.mockClear();

    await act(async () => {
      result.current.handleEndReached();
    });

    // hasMore is false so it should not fetch
    expect(mockFetchPage).not.toHaveBeenCalled();
  });

  it("step 5 - handleEndReached appends the next page with the correct offset", async () => {
    // first page loads on mount
    const firstItems = Array.from({ length: 30 }, (_, i) =>
      makePokemonListItem(i + 1),
    );
    mockFetchPage.mockResolvedValueOnce({ items: firstItems, hasMore: true });

    const { result } = renderHook(() => usePokemonList());
    await act(async () => {});

    expect(result.current.list).toHaveLength(30);
    mockFetchPage.mockClear();

    // second page via handleEndReached
    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    await act(async () => {
      result.current.handleEndReached();
    });

    expect(mockFetchPage).toHaveBeenCalledWith(30, 30);
    expect(result.current.list).toHaveLength(32);
    expect(mockTestStore.getState().hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("step 6 - refreshList resets the state and fetches again from 0", async () => {
    // initial load
    mockFetchPage.mockResolvedValueOnce(makePage(30, true));

    const { result } = renderHook(() => usePokemonList());
    await act(async () => {});

    expect(result.current.list).toHaveLength(30);
    mockFetchPage.mockClear();

    // refresh
    mockFetchPage.mockResolvedValueOnce(makePage(1, true));

    await act(async () => {
      result.current.refreshList();
    });

    expect(mockFetchPage).toHaveBeenCalledWith(0, 30);
    expect(result.current.list).toHaveLength(1);
  });

  it("step 7 - handleRetry clears error and fetches again", async () => {
    // initial load fails
    mockFetchPage.mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => usePokemonList());
    await act(async () => {});

    expect(result.current.error).toBe("fail");
    mockFetchPage.mockClear();

    // retry succeeds
    mockFetchPage.mockResolvedValueOnce(makePage(2, false));

    await act(async () => {
      result.current.handleRetry();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.list).toHaveLength(2);
  });
});

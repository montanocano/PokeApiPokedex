// tests for the usePokemonDetail hook
// we use a mock repository so we dont depend on the real api

import { renderHook, act } from "@testing-library/react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { createPokemonDetailStore } from "../store/pokemonDetailStore";
import type { PokemonDetailStore } from "../store/pokemonDetailStore";
import type { PokemonDetailRepository } from "../repositories/DefaultPokemonDetailRepository";
import type { PokemonDetail } from "../../../shared/api/Types";

// mock of getDetail to control what it returns in each test
const mockGetDetail = jest.fn<Promise<PokemonDetail>, [number | string]>();

const mockRepository: PokemonDetailRepository = {
  getDetail: mockGetDetail,
};

// test store, prefixed with "mock" so jest.mock() can reference it
let mockTestStore: StoreApi<PokemonDetailStore>;

// we replace store.ts so the hook uses our test store
jest.mock("../store/store", () => {
  const { useStore } = jest.requireActual<typeof import("zustand")>("zustand");
  function usePokemonDetailStore(
    selector: (state: PokemonDetailStore) => unknown,
  ) {
    return useStore(mockTestStore, selector);
  }
  return { usePokemonDetailStore };
});

// creates a fake PokemonDetail
function makeDetail(id: number): PokemonDetail {
  return {
    id,
    name: `pokemon-${id}`,
    height: 7,
    weight: 69,
    baseExperience: 64,
    types: ["water"],
    stats: [
      { baseStat: 44, effort: 0, statName: "hp" },
      { baseStat: 48, effort: 0, statName: "attack" },
    ],
    abilities: [{ abilityName: "torrent", isHidden: false, slot: 1 }],
    sprites: {
      frontDefault: "https://example.com/front.png",
      frontShiny: null,
      officialArtwork: null,
      home: null,
    },
    moves: [{ moveName: "tackle", levelLearnedAt: 1, learnMethod: "level-up" }],
    speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/7/",
  };
}

function resetStore() {
  mockTestStore = createStore(createPokemonDetailStore(mockRepository));
}

beforeEach(() => {
  jest.clearAllMocks();
  resetStore();
});

describe("usePokemonDetail", () => {
  it("step 1 - fetches detail on mount when id is provided", async () => {
    const detail = makeDetail(25);
    mockGetDetail.mockResolvedValueOnce(detail);

    const { result } = renderHook(() => usePokemonDetail(25));

    await act(async () => {});

    expect(mockGetDetail).toHaveBeenCalledWith(25);
    expect(result.current.detail).toEqual(detail);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("step 2 - does not fetch when id is null", async () => {
    const { result } = renderHook(() => usePokemonDetail(null));

    await act(async () => {});

    expect(mockGetDetail).not.toHaveBeenCalled();
    expect(result.current.detail).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("step 3 - saves the error if the call fails", async () => {
    mockGetDetail.mockRejectedValueOnce(new Error("not found"));

    const { result } = renderHook(() => usePokemonDetail(999));

    await act(async () => {});

    expect(result.current.error).toBe("not found");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.detail).toBeNull();
  });

  it("step 3 - saves generic message if error is not an Error instance", async () => {
    mockGetDetail.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonDetail(999));

    await act(async () => {});

    expect(result.current.error).toBe("Something went wrong");
  });

  it("step 4 - clears detail on unmount", async () => {
    const detail = makeDetail(25);
    mockGetDetail.mockResolvedValueOnce(detail);

    const { result, unmount } = renderHook(() => usePokemonDetail(25));

    await act(async () => {});

    expect(result.current.detail).toEqual(detail);

    unmount();

    // after unmount the store should be cleared
    expect(mockTestStore.getState().detail).toBeNull();
    expect(mockTestStore.getState().isLoading).toBe(false);
    expect(mockTestStore.getState().error).toBeNull();
  });

  it("step 5 - handleRetry fetches again with the same id", async () => {
    // first call fails
    mockGetDetail.mockRejectedValueOnce(new Error("fail"));

    const { result } = renderHook(() => usePokemonDetail(25));

    await act(async () => {});

    expect(result.current.error).toBe("fail");
    mockGetDetail.mockClear();

    // retry succeeds
    const detail = makeDetail(25);
    mockGetDetail.mockResolvedValueOnce(detail);

    await act(async () => {
      result.current.handleRetry();
    });

    expect(mockGetDetail).toHaveBeenCalledWith(25);
    expect(result.current.error).toBeNull();
    expect(result.current.detail).toEqual(detail);
  });

  it("step 6 - handleRetry does nothing when id is null", async () => {
    const { result } = renderHook(() => usePokemonDetail(null));

    await act(async () => {});

    mockGetDetail.mockClear();

    await act(async () => {
      result.current.handleRetry();
    });

    expect(mockGetDetail).not.toHaveBeenCalled();
  });

  it("step 7 - fetches new detail when id changes", async () => {
    const detail25 = makeDetail(25);
    mockGetDetail.mockResolvedValueOnce(detail25);

    const { result, rerender } = renderHook(
      ({ id }: { id: number | null }) => usePokemonDetail(id),
      { initialProps: { id: 25 } },
    );

    await act(async () => {});

    expect(result.current.detail).toEqual(detail25);
    mockGetDetail.mockClear();

    // change id to 150
    const detail150 = makeDetail(150);
    mockGetDetail.mockResolvedValueOnce(detail150);

    rerender({ id: 150 });

    await act(async () => {});

    expect(mockGetDetail).toHaveBeenCalledWith(150);
    expect(result.current.detail).toEqual(detail150);
  });
});

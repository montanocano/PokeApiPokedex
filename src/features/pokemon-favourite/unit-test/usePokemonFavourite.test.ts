// Tests for usePokemonFavourite hook
// Uses a vanilla store so we don't depend on AsyncStorage or the real persisted store

import { renderHook, act } from "@testing-library/react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { usePokemonFavourite } from "../hooks/usePokemonFavourite";
import { createPokemonFavouriteStore } from "../store/pokemonFavouriteStore";
import type { PokemonFavouriteStore } from "../store/pokemonFavouriteStore";
import type { PokemonListItem } from "../../pokemon-list/repositories/DefaultPokemonRepository";

let mockTestStore: StoreApi<PokemonFavouriteStore>;

jest.mock("../store/store", () => ({
  usePokemonFavouriteStore: (
    selector: (state: PokemonFavouriteStore) => unknown,
  ) =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("zustand").useStore(mockTestStore, selector),
}));

function makePokemon(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["water"] };
}

beforeEach(() => {
  mockTestStore = createStore(createPokemonFavouriteStore());
});

describe("usePokemonFavourite", () => {
  it("returns an empty favourites list initially", () => {
    const { result } = renderHook(() => usePokemonFavourite());
    expect(result.current.favourites).toEqual([]);
  });

  it("handleToggle adds a pokemon to favourites", () => {
    const { result } = renderHook(() => usePokemonFavourite());
    const p = makePokemon(1);

    act(() => {
      result.current.handleToggle(p);
    });

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.favourites[0].id).toBe(1);
  });

  it("handleToggle removes a pokemon that was already favourite", () => {
    const p = makePokemon(1);
    mockTestStore.getState().addFavourite(p);

    const { result } = renderHook(() => usePokemonFavourite());
    expect(result.current.favourites).toHaveLength(1);

    act(() => {
      result.current.handleToggle(p);
    });

    expect(result.current.favourites).toHaveLength(0);
  });

  it("isFavourite returns true for a pokemon in favourites", () => {
    const p = makePokemon(7);
    mockTestStore.getState().addFavourite(p);

    const { result } = renderHook(() => usePokemonFavourite());
    expect(result.current.isFavourite(7)).toBe(true);
  });

  it("isFavourite returns false for a pokemon not in favourites", () => {
    const { result } = renderHook(() => usePokemonFavourite());
    expect(result.current.isFavourite(99)).toBe(false);
  });

  it("favourites updates reactively after handleToggle", () => {
    const { result } = renderHook(() => usePokemonFavourite());

    act(() => {
      result.current.handleToggle(makePokemon(10));
      result.current.handleToggle(makePokemon(20));
    });

    expect(result.current.favourites).toHaveLength(2);

    act(() => {
      result.current.handleToggle(makePokemon(10));
    });

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.favourites[0].id).toBe(20);
  });
});

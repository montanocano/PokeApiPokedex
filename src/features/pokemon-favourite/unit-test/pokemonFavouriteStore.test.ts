// Tests for pokemonFavouriteStore
// Exercises add, remove, toggle, isFavourite, and duplicate guard

import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand";
import {
  createPokemonFavouriteStore,
  selectFavourites,
  selectIsFavourite,
} from "../store/pokemonFavouriteStore";
import type { PokemonFavouriteStore } from "../store/pokemonFavouriteStore";
import type { PokemonListItem } from "../../pokemon-list/repositories/DefaultPokemonRepository";

function makePokemon(id: number): PokemonListItem {
  return { id, name: `pokemon-${id}`, sprite: null, types: ["fire"] };
}

describe("pokemonFavouriteStore", () => {
  let store: StoreApi<PokemonFavouriteStore>;

  beforeEach(() => {
    // Zustand v5: createStore is curried — createStore<T>()(initializer)
    store = createStore<PokemonFavouriteStore>()(createPokemonFavouriteStore());
  });

  it("starts with an empty favourites list", () => {
    expect(selectFavourites(store.getState())).toEqual([]);
  });

  it("addFavourite adds a pokemon to the list", () => {
    const p = makePokemon(1);
    store.getState().addFavourite(p);
    const favs = selectFavourites(store.getState());
    expect(favs).toHaveLength(1);
    expect(favs[0]).toEqual(p);
  });

  it("addFavourite does not add the same pokemon twice", () => {
    const p = makePokemon(1);
    store.getState().addFavourite(p);
    store.getState().addFavourite(p);
    expect(selectFavourites(store.getState())).toHaveLength(1);
  });

  it("removeFavourite removes only the targeted pokemon", () => {
    store.getState().addFavourite(makePokemon(1));
    store.getState().addFavourite(makePokemon(2));
    store.getState().removeFavourite(1);
    const favs = selectFavourites(store.getState());
    expect(favs).toHaveLength(1);
    expect(favs[0].id).toBe(2);
  });

  it("removeFavourite is a no-op for a non-existent id", () => {
    store.getState().addFavourite(makePokemon(1));
    store.getState().removeFavourite(99);
    expect(selectFavourites(store.getState())).toHaveLength(1);
  });

  it("isFavourite returns true for an added pokemon", () => {
    store.getState().addFavourite(makePokemon(5));
    expect(selectIsFavourite(store.getState())(5)).toBe(true);
  });

  it("isFavourite returns false for a pokemon not in the list", () => {
    expect(selectIsFavourite(store.getState())(99)).toBe(false);
  });

  it("toggleFavourite adds a pokemon when it is not yet a favourite", () => {
    const p = makePokemon(3);
    store.getState().toggleFavourite(p);
    expect(selectFavourites(store.getState())).toHaveLength(1);
    expect(selectIsFavourite(store.getState())(3)).toBe(true);
  });

  it("toggleFavourite removes a pokemon that is already a favourite", () => {
    const p = makePokemon(3);
    store.getState().addFavourite(p);
    store.getState().toggleFavourite(p);
    expect(selectFavourites(store.getState())).toHaveLength(0);
  });

  it("toggleFavourite twice leaves the list in the original state", () => {
    const p = makePokemon(7);
    store.getState().toggleFavourite(p);
    store.getState().toggleFavourite(p);
    expect(selectFavourites(store.getState())).toHaveLength(0);
  });
});

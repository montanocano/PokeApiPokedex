// unit tests for the searchFilterStore
// tests state transitions for each action in isolation

import { createStore } from "zustand/vanilla";
import { createSearchFilterStore } from "../store/searchFilterStore";

function makeStore() {
  return createStore(createSearchFilterStore());
}

describe("searchFilterStore", () => {
  it("step 1 - starts with empty searchQuery, no selectedTypes, and no selectedGeneration", () => {
    const store = makeStore();
    expect(store.getState().searchQuery).toBe("");
    expect(store.getState().selectedTypes).toEqual([]);
    expect(store.getState().selectedGeneration).toBeNull();
  });

  it("step 2 - setSearchQuery updates the query", () => {
    const store = makeStore();
    store.getState().setSearchQuery("bulba");
    expect(store.getState().searchQuery).toBe("bulba");
  });

  it("step 3 - toggleType adds a type when not present", () => {
    const store = makeStore();
    store.getState().toggleType("fire");
    expect(store.getState().selectedTypes).toEqual(["fire"]);
  });

  it("step 4 - toggleType removes a type when already selected", () => {
    const store = makeStore();
    store.getState().toggleType("fire");
    store.getState().toggleType("fire");
    expect(store.getState().selectedTypes).toEqual([]);
  });

  it("step 5 - toggleType supports multiple types simultaneously", () => {
    const store = makeStore();
    store.getState().toggleType("fire");
    store.getState().toggleType("water");
    store.getState().toggleType("grass");
    expect(store.getState().selectedTypes).toEqual(["fire", "water", "grass"]);
  });

  it("step 6 - toggleType removes only the toggled type, leaving others intact", () => {
    const store = makeStore();
    store.getState().toggleType("fire");
    store.getState().toggleType("water");
    store.getState().toggleType("fire");
    expect(store.getState().selectedTypes).toEqual(["water"]);
  });

  it("step 7 - setGeneration sets the selected generation", () => {
    const store = makeStore();
    store.getState().setGeneration(3);
    expect(store.getState().selectedGeneration).toBe(3);
  });

  it("step 8 - setGeneration with null clears the generation", () => {
    const store = makeStore();
    store.getState().setGeneration(3);
    store.getState().setGeneration(null);
    expect(store.getState().selectedGeneration).toBeNull();
  });

  it("step 9 - clearFilters resets query, selectedTypes, and selectedGeneration", () => {
    const store = makeStore();
    store.getState().setSearchQuery("char");
    store.getState().toggleType("fire");
    store.getState().setGeneration(2);
    store.getState().clearFilters();
    expect(store.getState().searchQuery).toBe("");
    expect(store.getState().selectedTypes).toEqual([]);
    expect(store.getState().selectedGeneration).toBeNull();
  });

  it("step 10 - toggleGeneration selects a generation when none is active", () => {
    const store = makeStore();
    store.getState().toggleGeneration(3);
    expect(store.getState().selectedGeneration).toBe(3);
  });

  it("step 11 - toggleGeneration deselects a generation when the same one is active", () => {
    const store = makeStore();
    store.getState().toggleGeneration(3);
    store.getState().toggleGeneration(3);
    expect(store.getState().selectedGeneration).toBeNull();
  });

  it("step 12 - toggleGeneration switches to a different generation", () => {
    const store = makeStore();
    store.getState().toggleGeneration(3);
    store.getState().toggleGeneration(5);
    expect(store.getState().selectedGeneration).toBe(5);
  });
});

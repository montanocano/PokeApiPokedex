// unit tests for the searchFilterStore
// tests state transitions for each action in isolation

import { createStore } from "zustand/vanilla";
import { createSearchFilterStore } from "../store/searchFilterStore";

function makeStore() {
  return createStore(createSearchFilterStore());
}

describe("searchFilterStore", () => {
  it("step 1 - starts with empty searchQuery and no selectedTypes", () => {
    const store = makeStore();
    expect(store.getState().searchQuery).toBe("");
    expect(store.getState().selectedTypes).toEqual([]);
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

  it("step 7 - clearFilters resets both query and selectedTypes", () => {
    const store = makeStore();
    store.getState().setSearchQuery("char");
    store.getState().toggleType("fire");
    store.getState().toggleType("water");
    store.getState().clearFilters();
    expect(store.getState().searchQuery).toBe("");
    expect(store.getState().selectedTypes).toEqual([]);
  });
});

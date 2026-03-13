import { useCallback } from "react";
import { usePokemonListStore } from "../store/pokemonListStore";
import { pokemonListRepository } from "../repository/pokemonListRepository";

export function usePokemonList() {
  const store = usePokemonListStore();

  const fetchPokemonList = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const { items, hasMore } = await pokemonListRepository.getPage(0);
      store.setList(items, hasMore);
    } catch (e) {
      store.setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const fetchNextPage = useCallback(async () => {
    if (store.isLoadingMore || !store.hasMore) return;
    store.setLoadingMore(true);
    store.setError(null);
    try {
      const { items, hasMore } = await pokemonListRepository.getPage(store.offset);
      store.appendList(items, hasMore);
    } catch (e) {
      store.setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      store.setLoadingMore(false);
    }
  }, [store]);

  const refreshList = useCallback(async () => {
    store.setList([], true);
    await fetchPokemonList();
  }, [store, fetchPokemonList]);

  return {
    ...store,
    fetchPokemonList,
    fetchNextPage,
    refreshList,
  };
}
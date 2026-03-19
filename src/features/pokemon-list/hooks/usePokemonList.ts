import { useEffect, useCallback } from "react";
import { usePokemonListStore } from "../store/pokemonListStore";

export function usePokemonList() {
  const {
    list,
    offset,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    fetchPokemonList,
    fetchNextPage,
    refreshList,
    clearError,
  } = usePokemonListStore();

  useEffect(() => {
    fetchPokemonList();
  }, [fetchPokemonList]);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchNextPage();
    }
  }, [isLoadingMore, hasMore, fetchNextPage]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchPokemonList();
  }, [clearError, fetchPokemonList]);

  const handleRetryMore = useCallback(() => {
    clearError();
    fetchNextPage();
  }, [clearError, fetchNextPage]);

  return {
    list,
    offset,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    fetchPokemonList,
    fetchNextPage,
    refreshList,
    handleEndReached,
    handleRetry,
    handleRetryMore,
  };
}
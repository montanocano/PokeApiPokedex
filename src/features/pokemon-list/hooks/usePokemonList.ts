import { useEffect, useCallback } from "react";
import { usePokemonListStore } from "../store/store";
import {
  selectList,
  selectHasMore,
  selectIsLoading,
  selectIsLoadingMore,
  selectError,
  selectFetchPokemonList,
  selectFetchNextPage,
  selectRefreshList,
  selectClearError,
} from "../store/pokemonListStore";

export function usePokemonList() {
  const list = usePokemonListStore(selectList);
  const hasMore = usePokemonListStore(selectHasMore);
  const isLoading = usePokemonListStore(selectIsLoading);
  const isLoadingMore = usePokemonListStore(selectIsLoadingMore);
  const error = usePokemonListStore(selectError);
  const fetchPokemonList = usePokemonListStore(selectFetchPokemonList);
  const fetchNextPage = usePokemonListStore(selectFetchNextPage);
  const refreshList = usePokemonListStore(selectRefreshList);
  const clearError = usePokemonListStore(selectClearError);

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
import { useEffect, useCallback } from "react";
import { usePokemonDetailStore } from "../store/store";
import {
  selectDetail,
  selectIsLoading,
  selectError,
  selectFetchDetail,
  selectClearDetail,
} from "../store/pokemonDetailStore";

export function usePokemonDetail(id: number | string | null) {
  const detail = usePokemonDetailStore(selectDetail);
  const isLoading = usePokemonDetailStore(selectIsLoading);
  const error = usePokemonDetailStore(selectError);
  const fetchDetail = usePokemonDetailStore(selectFetchDetail);
  const clearDetail = usePokemonDetailStore(selectClearDetail);

  useEffect(() => {
    if (id !== null) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  useEffect(() => {
    return () => {
      clearDetail();
    };
  }, [clearDetail]);

  const handleRetry = useCallback(() => {
    if (id !== null) {
      fetchDetail(id);
    }
  }, [id, fetchDetail]);

  return {
    detail,
    isLoading,
    error,
    handleRetry,
  };
}

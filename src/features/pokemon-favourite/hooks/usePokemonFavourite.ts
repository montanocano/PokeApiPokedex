import { useCallback } from "react";
import { usePokemonFavouriteStore } from "../store/store";
import {
  selectFavourites,
  selectToggleFavourite,
  selectIsFavourite,
} from "../store/pokemonFavouriteStore";
import type { PokemonListItem } from "../../pokemon-list/repositories/DefaultPokemonRepository";

export function usePokemonFavourite() {
  const favourites = usePokemonFavouriteStore(selectFavourites);
  const toggleFavourite = usePokemonFavouriteStore(selectToggleFavourite);
  const isFavourite = usePokemonFavouriteStore(selectIsFavourite);

  const handleToggle = useCallback(
    (pokemon: PokemonListItem) => {
      toggleFavourite(pokemon);
    },
    [toggleFavourite],
  );

  return {
    favourites,
    isFavourite,
    handleToggle,
  };
}

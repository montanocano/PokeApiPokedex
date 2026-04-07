import { useLocalSearchParams } from "expo-router";
import PokemonDetailScreen from "../src/shared/ui/screens/pokemonDetailScreen";

export default function DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pokemonId = Number(Array.isArray(id) ? id[0] : id);
  return <PokemonDetailScreen pokemonId={pokemonId} />;
}

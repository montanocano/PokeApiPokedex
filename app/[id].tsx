import { useLocalSearchParams } from "expo-router";
import PokemonDetailScreen from "../src/shared/ui/screens/pokemonDetailScreen";

export default function DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PokemonDetailScreen pokemonId={id} />;
}

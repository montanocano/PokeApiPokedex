import { ScrollView } from "react-native";
import { XStack } from "tamagui";
import { Chip } from "./Chip";
import { typeColors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { POKEMON_TYPE_NAMES } from "../../api/Types";
import type { PokemonTypeName } from "../../api/Types";

interface TypeFilterProps {
  selectedTypes: PokemonTypeName[];
  onTypeToggle: (type: PokemonTypeName) => void;
}

export function TypeFilter({ selectedTypes, onTypeToggle }: TypeFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        alignItems: "center",
      }}
      accessibilityLabel="Filter by Pokémon type"
    >
      {POKEMON_TYPE_NAMES.map((type) => (
        <XStack key={type} marginRight="$sm">
          <Chip
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            color={typeColors[type]}
            chipSize="md"
            selected={selectedTypes.includes(type)}
            onPress={() => onTypeToggle(type)}
          />
        </XStack>
      ))}
    </ScrollView>
  );
}

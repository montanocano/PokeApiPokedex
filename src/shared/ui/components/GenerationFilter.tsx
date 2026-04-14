import { ScrollView } from "react-native";
import { XStack, useTheme } from "tamagui";
import { Chip } from "./Chip";
import { spacing } from "../tokens/spacing";

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationChange: (gen: number) => void;
}

export function GenerationFilter({
  selectedGeneration,
  onGenerationChange,
}: GenerationFilterProps) {
  const theme = useTheme();
  const chipColor = theme.colorPress?.val as string;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        alignItems: "center",
      }}
      accessibilityLabel="Filter by Pokémon generation"
    >
      {GENERATIONS.map((gen) => (
        <XStack key={gen} marginRight="$sm">
          <Chip
            label={`Gen ${gen}`}
            color={chipColor}
            chipSize="md"
            selected={selectedGeneration === gen}
            onPress={() => onGenerationChange(gen)}
          />
        </XStack>
      ))}
    </ScrollView>
  );
}

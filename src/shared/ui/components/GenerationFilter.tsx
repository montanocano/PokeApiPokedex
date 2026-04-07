import { ScrollView, StyleSheet } from "react-native";
import { XStack } from "tamagui";
import { Chip } from "./Chip";

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationChange: (gen: number) => void;
}

export function GenerationFilter({
  selectedGeneration,
  onGenerationChange,
}: GenerationFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      accessibilityLabel="Filter by Pokémon generation"
    >
      {GENERATIONS.map((gen) => (
        <XStack key={gen} marginRight={8}>
          <Chip
            label={`Gen ${gen}`}
            color="#607D8B"
            chipSize="md"
            selected={selectedGeneration === gen}
            onPress={() => onGenerationChange(gen)}
          />
        </XStack>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
});

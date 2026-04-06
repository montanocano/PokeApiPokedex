import { View, StyleSheet } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Image } from "expo-image";
import { Chip } from "./Chip";
import type { PokemonTypeName } from "../../api/Types";
import { capitalise } from "../../utils/formatters";

interface PokemonHeroSectionProps {
  name: string;
  types: PokemonTypeName[];
  imageUri: string | null;
}

export function PokemonHeroSection({
  name,
  types,
  imageUri,
}: PokemonHeroSectionProps) {
  return (
    <>
      <YStack paddingHorizontal="$xl" paddingBottom="$sm">
        <Text fontSize={32} fontWeight="700" color="white">
          {capitalise(name)}
        </Text>
        <XStack gap="$sm" marginTop="$sm">
          {types.map((type) => (
            <Chip
              key={type}
              label={capitalise(type)}
              color="rgba(255,255,255,0.35)"
              chipSize="md"
            />
          ))}
        </XStack>
      </YStack>

      <YStack alignItems="center" paddingVertical="$sm">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.pokemonImage}
            contentFit="contain"
            accessibilityLabel={`${capitalise(name)} artwork`}
          />
        ) : (
          <View style={[styles.pokemonImage, styles.imagePlaceholder]}>
            <Text color="rgba(255,255,255,0.4)" fontSize="$6">
              ?
            </Text>
          </View>
        )}
      </YStack>
    </>
  );
}

const styles = StyleSheet.create({
  pokemonImage: {
    width: 180,
    height: 180,
  },
  imagePlaceholder: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
});

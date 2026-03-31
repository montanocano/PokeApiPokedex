import { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { YStack, Text } from "tamagui";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/button";
import {
  DetailHeader,
  PokemonHeroSection,
  AboutSection,
  StatsSection,
} from "../components";
import { usePokemonDetail } from "../../../features/pokemon-details/hooks/usePokemonDetail";
import { typeColors, lightColors, primaryColors } from "../tokens/colors";
import type { PokemonTypeName } from "../../api/Types";

interface PokemonDetailScreenProps {
  pokemonId: number | string;
}

export default function PokemonDetailScreen({
  pokemonId,
}: PokemonDetailScreenProps) {
  const router = useRouter();
  const { detail, isLoading, error, handleRetry } = usePokemonDetail(pokemonId);

  const primaryType = detail?.types[0] as PokemonTypeName | undefined;
  const bgColor = primaryType ? typeColors[primaryType] : primaryColors.primary;

  const totalStats = useMemo(
    () => detail?.stats.reduce((sum, s) => sum + s.baseStat, 0) ?? 0,
    [detail?.stats],
  );

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$md">
          <ActivityIndicator size="large" color="#fff" />
          <Text color="white" fontSize="$2">
            Loading Pokémon...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: lightColors.background }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={primaryColors.primary} />
        </TouchableOpacity>
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          gap="$md"
          paddingHorizontal="$xl"
        >
          <Text fontSize="$4" fontWeight="600" color="$color">
            Oops!
          </Text>
          <Text fontSize="$2" color="$textSecondary" textAlign="center">
            {error}
          </Text>
          <Button variant="secondary" size="sm" onPress={handleRetry}>
            Try Again
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }

  if (!detail) return null;

  const imageUri =
    detail.sprites.officialArtwork ??
    detail.sprites.home ??
    detail.sprites.frontDefault;

  // ── Happy path: composes section components ──
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <DetailHeader pokemonId={detail.id} onBack={() => router.back()} />

      <PokemonHeroSection
        name={detail.name}
        types={detail.types}
        imageUri={imageUri}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <YStack
          backgroundColor="$surface"
          paddingHorizontal="$xl"
          paddingTop="$xl"
          paddingBottom="$xxl"
          gap="$xl"
          minHeight="100%"
        >
          <AboutSection
            height={detail.height}
            weight={detail.weight}
            abilities={detail.abilities}
            accentColor={bgColor}
          />
          <StatsSection stats={detail.stats} total={totalStats} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
  },
});

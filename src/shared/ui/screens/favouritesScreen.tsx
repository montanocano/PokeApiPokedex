import { useCallback, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  useColorScheme,
} from "react-native";
import { YStack, XStack, Text, styled } from "tamagui";
import { PokemonCard } from "../components";
import { useRouter } from "expo-router";
import { usePokemonFavourite } from "../../../features/pokemon-favourite/hooks/usePokemonFavourite";
import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import { lightColors, darkColors } from "../tokens/colors";

const ScreenContainer = styled(YStack, {
  flex: 1,
  backgroundColor: "$background",
});

const HeaderContainer = styled(XStack, {
  height: 56,
  paddingHorizontal: "$xl",
  alignItems: "center",
  backgroundColor: "$background",
});

const HeaderTitle = styled(Text, {
  fontSize: "$6",
  fontWeight: "700",
  color: "$primary",
});

const EmptyContainer = styled(YStack, {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: "$xl",
  gap: "$md",
});

export default function FavouritesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;
  const { favourites, handleToggle } = usePokemonFavourite();

  // Derive a Set from the favourites array — avoids calling get() at render time
  const favouriteIds = useMemo(
    () => new Set(favourites.map((f) => f.id)),
    [favourites],
  );

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard
        item={item}
        onPress={() =>
          router.push({ pathname: "/[id]", params: { id: String(item.id) } })
        }
        isFavourite={favouriteIds.has(item.id)}
        onToggleFavourite={handleToggle}
      />
    ),
    [router, favouriteIds, handleToggle],
  );

  const keyExtractor = useCallback(
    (item: PokemonListItem) => String(item.id),
    [],
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScreenContainer>
        <HeaderContainer>
          <HeaderTitle>Favourites</HeaderTitle>
        </HeaderContainer>

        {favourites.length === 0 ? (
          <EmptyContainer>
            <Text fontSize="$5">♡</Text>
            <Text fontSize="$4" fontWeight="600" color="$textPrimary">
              No favourites yet
            </Text>
            <Text fontSize="$2" color="$textSecondary" textAlign="center">
              Tap the heart on any Pokémon to add it here.
            </Text>
          </EmptyContainer>
        ) : (
          <FlatList
            data={favourites}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
});

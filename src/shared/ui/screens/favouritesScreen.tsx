"use no memo";
import { useCallback } from "react";
import { SafeAreaView, StyleSheet, FlatList } from "react-native";
import { YStack, XStack, Text, styled } from "tamagui";
import { PokemonCard } from "../components";
import { useRouter } from "expo-router";
import { usePokemonFavourite } from "../../../features/pokemon-favourite/indexs";
import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import { lightColors } from "../tokens/colors";

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
  const { favourites, isFavourite, handleToggle } = usePokemonFavourite();

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard
        item={item}
        onPress={() =>
          router.push({ pathname: "/[id]", params: { id: String(item.id) } })
        }
        isFavourite={isFavourite(item.id)}
        onToggleFavourite={handleToggle}
      />
    ),
    [router, isFavourite, handleToggle],
  );

  const keyExtractor = useCallback(
    (item: PokemonListItem) => String(item.id),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
    backgroundColor: lightColors.background,
  },
  listContent: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
});

import { useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { YStack, XStack, Text, styled } from "tamagui";
import { useRouter } from "expo-router";
import { Button } from "../components/button";
import { PokemonCard } from "../components/pokemonCard";
import { usePokemonList } from "../../../features/pokemon-list/hooks/usePokemonList";
import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import { primaryColors, lightColors } from "../tokens/colors";

// Styled components (project tokens)

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

const CenterContainer = styled(YStack, {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: "$xl",
  gap: "$md",
});

const FooterContainer = styled(YStack, {
  paddingVertical: "$lg",
  alignItems: "center",
});

// Screen

export default function HomeScreen() {
  const router = useRouter();
  const {
    list,
    isLoading,
    isLoadingMore,
    error,
    handleEndReached,
    handleRetry,
    refreshList,
  } = usePokemonList();

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard
        item={item}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPress={() =>
          router.push({ pathname: "/[id]" as any, params: { id: item.id } })
        }
      />
    ),
    [router],
  );

  const keyExtractor = useCallback(
    (item: PokemonListItem) => String(item.id),
    [],
  );

  // Loading state
  if (isLoading && list.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenContainer>
          <HeaderContainer>
            <HeaderTitle>Pokédex</HeaderTitle>
          </HeaderContainer>
          <CenterContainer>
            <ActivityIndicator size="large" color={primaryColors.primary} />
            <Text fontSize="$2" color="$textSecondary">
              Loading Pokémon...
            </Text>
          </CenterContainer>
        </ScreenContainer>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && list.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenContainer>
          <HeaderContainer>
            <HeaderTitle>Pokédex</HeaderTitle>
          </HeaderContainer>
          <CenterContainer>
            <Text fontSize="$4" fontWeight="600" color="$color">
              Oops!
            </Text>
            <Text fontSize="$2" color="$textSecondary" textAlign="center">
              {error}
            </Text>
            <Button variant="secondary" size="sm" onPress={handleRetry}>
              Try Again
            </Button>
          </CenterContainer>
        </ScreenContainer>
      </SafeAreaView>
    );
  }

  // Main list
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenContainer>
        <HeaderContainer>
          <HeaderTitle>Pokédex</HeaderTitle>
        </HeaderContainer>

        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={refreshList}
          refreshing={isLoading}
          ListFooterComponent={
            isLoadingMore ? (
              <FooterContainer>
                <ActivityIndicator size="small" color={primaryColors.primary} />
              </FooterContainer>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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

import { useCallback, useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { YStack, XStack, Text, styled } from "tamagui";
import {
  Button,
  PokemonCard,
  SearchInput,
  TypeFilter,
  GenerationFilter,
} from "../components";
import { useRouter } from "expo-router";
import { usePokemonList } from "../../../features/pokemon-list/hooks/usePokemonList";
import { useSearchFilter } from "../../../features/pokemon-list/search-filter";
import { usePokemonFavourite } from "../../../features/pokemon-favourite/hooks/usePokemonFavourite";
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

const SearchContainer = styled(YStack, {
  paddingHorizontal: "$3",
  paddingTop: "$2",
  backgroundColor: "$background",
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
  const { handleToggle, favourites } = usePokemonFavourite();
  const favouriteIds = useMemo(
    () => new Set(favourites.map((f) => f.id)),
    [favourites],
  );
  const {
    list,
    isLoading,
    isLoadingMore,
    error,
    handleEndReached,
    handleRetry,
    refreshList,
  } = usePokemonList();

  const {
    inputValue,
    searchQuery,
    selectedTypes,
    selectedGeneration,
    filteredList,
    handleSearchChange,
    handleTypeToggle,
    handleGenerationChange,
    handleClearFilters,
  } = useSearchFilter({ list });

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedTypes.length > 0 ||
    selectedGeneration !== null;

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

  // Loading state — show spinner only while the initial request is in progress
  if (isLoading && list.length === 0 && !error) {
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

        <SearchContainer>
          <XStack alignItems="center" gap="$2">
            <YStack flex={1}>
              <SearchInput
                value={inputValue}
                onChangeText={handleSearchChange}
              />
            </YStack>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onPress={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </XStack>
          <TypeFilter
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />
          <GenerationFilter
            selectedGeneration={selectedGeneration}
            onGenerationChange={handleGenerationChange}
          />
        </SearchContainer>

        <FlatList
          data={filteredList}
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
          style={styles.list}
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
});

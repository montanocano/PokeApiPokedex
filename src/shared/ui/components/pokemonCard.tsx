import { memo, useCallback } from "react";
import { Platform } from "react-native";
import { YStack, XStack, Text, styled } from "tamagui";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { FavouriteButton } from "./FavouriteButton";
import type { PokemonListItem } from "../../../features/pokemon-list/repositories/DefaultPokemonRepository";
import type { PokemonTypeName } from "../../api/Types";
import { typeColors } from "../tokens/colors";

// Styled sub-components

const CardContent = styled(XStack, {
  alignItems: "center",
  gap: "$md",
});

const SpritePlaceholder = styled(YStack, {
  width: 96,
  height: 96,
  borderRadius: "$full",
  backgroundColor: "$surfaceHover",
  alignItems: "center",
  justifyContent: "center",
});

const InfoContainer = styled(YStack, {
  flex: 1,
  gap: "$xs",
});

const TypesRow = styled(XStack, {
  gap: "$sm",
  flexWrap: "wrap",
  marginTop: "$xs",
});

// Helpers

function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Component

interface PokemonCardProps {
  item: PokemonListItem;
  onPress?: () => void;
  isFavourite?: boolean;
  onToggleFavourite?: (item: PokemonListItem) => void;
}

function PokemonCardBase({
  item,
  onPress,
  isFavourite,
  onToggleFavourite,
}: PokemonCardProps) {
  // Stable callback — avoids creating a new closure on every render inside FavouriteButton
  const handleFavouritePress = useCallback(() => {
    onToggleFavourite?.(item);
  }, [item, onToggleFavourite]);

  const card = (
    <Card
      pressable
      onPress={onPress}
      marginBottom="$md"
      elevation={3}
      pressStyle={{ scale: 0.98, backgroundColor: "$surfaceHover" }}
      hoverStyle={{ backgroundColor: "$surfaceHover" }}
      accessibilityRole="button"
      accessibilityLabel={`${capitalise(item.name)}, number ${item.id}`}
    >
      <CardContent>
        {item.sprite ? (
          <Image
            source={{ uri: item.sprite }}
            style={{ width: 96, height: 96 }}
            contentFit="contain"
          />
        ) : (
          <SpritePlaceholder>
            <Text fontSize="$1" color="$textDisabled">
              Who&apos;s that Pokémon?
            </Text>
          </SpritePlaceholder>
        )}

        <InfoContainer>
          <Text fontFamily="$mono" fontSize="$1" color="$textSecondary">
            {formatPokemonId(item.id)}
          </Text>
          <Text fontSize="$4" fontWeight="600" color="$textPrimary">
            {capitalise(item.name)}
          </Text>
          <TypesRow>
            {item.types.map((type: PokemonTypeName) => (
              <Chip
                key={type}
                label={capitalise(type)}
                color={typeColors[type]}
                chipSize="md"
              />
            ))}
          </TypesRow>
        </InfoContainer>

        {onToggleFavourite !== undefined && (
          <FavouriteButton
            isFavourite={isFavourite ?? false}
            onPress={handleFavouritePress}
          />
        )}
      </CardContent>
    </Card>
  );

  // On web, reanimated's Animated.View can leave items invisible (opacity:0)
  // if the animation runtime isn't fully initialized. Use a plain wrapper instead.
  if (Platform.OS === "web") {
    return card;
  }

  return (
    <Animated.View entering={FadeInDown.duration(250)}>{card}</Animated.View>
  );
}

export const PokemonCard = memo(PokemonCardBase);

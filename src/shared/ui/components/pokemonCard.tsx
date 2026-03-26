import { memo } from "react";
import { YStack, XStack, Text, styled } from "tamagui";
import { Image } from "expo-image";
import { Card } from "./Card";
import { Chip } from "./Chip";
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
}

function PokemonCardBase({ item, onPress }: PokemonCardProps) {
  return (
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
              Who's that Pokémon?
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
      </CardContent>
    </Card>
  );
}

export const PokemonCard = memo(PokemonCardBase);

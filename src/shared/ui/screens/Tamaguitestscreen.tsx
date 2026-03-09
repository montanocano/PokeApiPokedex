import React from "react";
import { SafeAreaView } from "react-native";
import { YStack, XStack, Text, Button, styled, getTokens } from "tamagui";

//Styled card using Tamagui's styled() API
const Card = styled(YStack, {
  backgroundColor: "$surface",
  borderRadius: "$md",
  padding: "$md",
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,
  borderColor: "$border",
});

const TypeBadge = styled(XStack, {
  paddingHorizontal: "$sm",
  paddingVertical: "$xs",
  borderRadius: "$sm",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    pokemonType: {
      electric: { backgroundColor: "$typeElectric" },
      fire: { backgroundColor: "$typeFire" },
      water: { backgroundColor: "$typeWater" },
      grass: { backgroundColor: "$typeGrass" },
      normal: { backgroundColor: "$typeNormal" },
    },
  } as const,
});

//Test screen
// This screen exists only to verify that Tamagui is configured
// correctly: tokens resolve, styled() works, themes apply.
// It can be deleted once the real HomeScreen is in place.

export function TamaguiTestScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$xl" gap="$lg">
        {/* Header */}
        <Text
          fontFamily="$body"
          fontSize="$6"
          fontWeight="700"
          color="$primary"
        >
          Pokédex
        </Text>

        <Text fontSize="$3" color="$textSecondary">
          Tamagui is working. Tokens, themes and styled() are all resolving
          correctly.
        </Text>

        {/* Sample card — mimics a PokemonCard */}
        <Card>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$xs">
              <Text fontFamily="$mono" fontSize="$1" color="$textSecondary">
                #025
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$textPrimary">
                Pikachu
              </Text>
            </YStack>
            <Text fontSize={24}>⚡</Text>
          </XStack>

          <XStack gap="$sm" marginTop="$sm">
            <TypeBadge pokemonType="electric">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Electric
              </Text>
            </TypeBadge>
          </XStack>
        </Card>

        {/* Second card to check variety */}
        <Card>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$xs">
              <Text fontFamily="$mono" fontSize="$1" color="$textSecondary">
                #006
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$textPrimary">
                Charizard
              </Text>
            </YStack>
            <Text fontSize={24}>🔥</Text>
          </XStack>

          <XStack gap="$sm" marginTop="$sm">
            <TypeBadge pokemonType="fire">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Fire
              </Text>
            </TypeBadge>
            <TypeBadge pokemonType="fire">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Flying
              </Text>
            </TypeBadge>
          </XStack>
        </Card>

        {/* Button to check interactive tokens */}
        <Button
          backgroundColor="$primary"
          borderRadius="$xl"
          pressStyle={{ backgroundColor: "$primaryDark" }}
        >
          <Text
            color="$textOnPrimary"
            fontWeight="600"
            fontSize="$3"
          >
            Explore Pokédex
          </Text>
        </Button>

        {/* Footer check */}
        <YStack flex={1} justifyContent="flex-end">
          <Text fontSize="$1" color="$textDisabled" textAlign="center">
            If you see this styled correctly, Tamagui is ready. Delete this
            file and build the real screens.
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
import { SafeAreaView } from "react-native";
import { YStack, XStack, Text, Button, styled } from "tamagui";

const Card = styled(YStack, {
  backgroundColor: "$surface",
  borderRadius: "$md",
  padding: "$3",
  borderWidth: 1,
  borderColor: "$border",
  elevation: 3,
});

const TypeBadge = styled(XStack, {
  paddingHorizontal: "$2",
  paddingVertical: "$1",
  borderRadius: "$sm",
  alignItems: "center",
  justifyContent: "center",
});

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$5" gap="$4">
        <Text fontSize="$6" fontWeight="700" color="$primary">
          Pokédex
        </Text>

        <Text fontSize="$3" color="$textSecondary">
          Tamagui is working. Tokens, themes and styled() are resolving.
        </Text>

        <Card>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$1">
              <Text fontFamily="$mono" fontSize="$1" color="$textSecondary">
                #025
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$color">
                Pikachu
              </Text>
            </YStack>
          </XStack>
          <XStack gap="$2" marginTop="$2">
            <TypeBadge backgroundColor="$typeElectric">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Electric
              </Text>
            </TypeBadge>
          </XStack>
        </Card>

        <Card>
          <XStack justifyContent="space-between" alignItems="center">
            <YStack gap="$1">
              <Text fontFamily="$mono" fontSize="$1" color="$textSecondary">
                #006
              </Text>
              <Text fontSize="$4" fontWeight="600" color="$color">
                Charizard
              </Text>
            </YStack>
          </XStack>
          <XStack gap="$2" marginTop="$2">
            <TypeBadge backgroundColor="$typeFire">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Fire
              </Text>
            </TypeBadge>
            <TypeBadge backgroundColor="$typeFlying">
              <Text fontSize="$1" fontWeight="500" color="$textOnPrimary">
                Flying
              </Text>
            </TypeBadge>
          </XStack>
        </Card>

        <Button
          backgroundColor="$primary"
          borderRadius="$md"
          pressStyle={{ backgroundColor: "$primaryDark" }}
        >
          <Text color="$textOnPrimary" fontWeight="600" fontSize="$3">
            Explore Pokédex
          </Text>
        </Button>

        <YStack flex={1} justifyContent="flex-end">
          <Text fontSize="$1" color="$textDisabled" textAlign="center">
            If you see this styled correctly, Tamagui is ready.
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
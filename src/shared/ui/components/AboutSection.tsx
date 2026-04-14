import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Chip } from "./Chip";
import type { ParsedAbility } from "../../api/Types";
import { formatHeight, formatWeight, capitalise } from "../../utils/formatters";

interface AboutSectionProps {
  height: number;
  weight: number;
  abilities: ParsedAbility[];
  accentColor: string;
}

export function AboutSection({
  height,
  weight,
  abilities,
  accentColor,
}: AboutSectionProps) {
  return (
    <YStack gap="$md">
      <Text fontSize="$5" fontWeight="700" color="$textPrimary">
        About
      </Text>

      <XStack gap="$md">
        <Card
          flex={1}
          variant="outlined"
          alignItems="center"
          gap="$xs"
          padding="$md"
        >
          <Ionicons name="resize-outline" size={20} color={accentColor} />
          <Text fontSize="$3" fontWeight="600" color="$textPrimary">
            {formatHeight(height)}
          </Text>
          <Text fontSize="$1" color="$textSecondary">
            Height
          </Text>
        </Card>

        <Card
          flex={1}
          variant="outlined"
          alignItems="center"
          gap="$xs"
          padding="$md"
        >
          <Ionicons name="scale-outline" size={20} color={accentColor} />
          <Text fontSize="$3" fontWeight="600" color="$textPrimary">
            {formatWeight(weight)}
          </Text>
          <Text fontSize="$1" color="$textSecondary">
            Weight
          </Text>
        </Card>
      </XStack>

      <Card variant="outlined" gap="$sm" padding="$md">
        <XStack alignItems="center" gap="$sm" marginBottom="$xs">
          <Ionicons name="flash-outline" size={18} color={accentColor} />
          <Text fontSize="$2" fontWeight="600" color="$textSecondary">
            Abilities
          </Text>
        </XStack>
        <XStack gap="$sm" flexWrap="wrap">
          {abilities.map((ab) => (
            <Chip
              key={ab.slot}
              label={capitalise(ab.abilityName.replace(/-/g, " "))}
              color={ab.isHidden ? "$textDisabled" : accentColor}
              chipSize="md"
            />
          ))}
        </XStack>
      </Card>
    </YStack>
  );
}

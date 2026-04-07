import { YStack, XStack, Text } from "tamagui";
import { Card } from "./Card";
import { StatRow } from "./StatRow";
import type { ParsedStat } from "../../api/Types";

interface StatsSectionProps {
  stats: ParsedStat[];
  total: number;
}

export function StatsSection({ stats, total }: StatsSectionProps) {
  return (
    <YStack gap="$md">
      <Text fontSize="$5" fontWeight="700" color="$textPrimary">
        Base Stats
      </Text>
      <Card variant="outlined" padding="$md" gap="$sm">
        {stats.map((stat) => (
          <StatRow key={stat.statName} stat={stat} />
        ))}
        <XStack alignItems="center" gap="$md" marginTop="$xs">
          <Text
            width={72}
            fontSize="$1"
            fontWeight="700"
            color="$textSecondary"
            textAlign="right"
          >
            Total
          </Text>
          <XStack width={1} height={16} backgroundColor="$border" />
          <Text fontSize="$2" fontWeight="700" color="$textPrimary">
            {total}
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
}

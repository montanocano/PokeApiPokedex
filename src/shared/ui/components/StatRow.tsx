import { View, StyleSheet } from "react-native";
import { XStack, Text } from "tamagui";
import type { ParsedStat } from "../../api/Types";
import { STAT_LABELS, MAX_STAT, capitalise } from "../../utils/formatters";
import { statColors } from "../tokens/colors";
import { radius } from "../tokens/radius";

// Presentation rule: maps a stat value range to a display color
function getStatColor(value: number): string {
  if (value < 50) return statColors.statLow;
  if (value < 80) return statColors.statMid;
  return statColors.statHigh;
}

interface StatRowProps {
  stat: ParsedStat;
}

export function StatRow({ stat }: StatRowProps) {
  const label = STAT_LABELS[stat.statName] ?? capitalise(stat.statName);
  const color = getStatColor(stat.baseStat);
  const fillPercent = Math.min((stat.baseStat / MAX_STAT) * 100, 100);

  return (
    <XStack alignItems="center" gap="$md">
      <Text
        width={72}
        fontSize="$1"
        fontWeight="600"
        color="$textSecondary"
        textAlign="right"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      <XStack width={1} height={16} backgroundColor="$border" />
      <Text width={32} fontSize="$1" fontWeight="700" style={{ color }}>
        {stat.baseStat}
      </Text>
      <XStack
        flex={1}
        height={6}
        backgroundColor="$border"
        borderRadius={radius.full}
        overflow="hidden"
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${fillPercent}%` as `${number}%`,
              backgroundColor: color,
            },
          ]}
        />
      </XStack>
    </XStack>
  );
}

const styles = StyleSheet.create({
  progressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
});

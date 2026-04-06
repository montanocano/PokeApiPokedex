import { StyleSheet, TouchableOpacity } from "react-native";
import { XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { formatId } from "../../utils/formatters";

interface DetailHeaderProps {
  pokemonId: number;
  onBack: () => void;
}

export function DetailHeader({ pokemonId, onBack }: DetailHeaderProps) {
  return (
    <XStack
      height={56}
      paddingHorizontal="$xl"
      alignItems="center"
      justifyContent="space-between"
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text fontFamily="$mono" fontSize="$1" color="rgba(255,255,255,0.8)">
        {formatId(pokemonId)}
      </Text>
    </XStack>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

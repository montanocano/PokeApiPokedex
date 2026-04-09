import { memo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  type GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { primaryColors } from "../tokens/colors";

interface FavouriteButtonProps {
  isFavourite: boolean;
  onPress: () => void;
  size?: number;
  accessibilityLabel?: string;
}

function FavouriteButtonBase({
  isFavourite,
  onPress,
  size = 24,
  accessibilityLabel,
}: FavouriteButtonProps) {
  const handlePress = (e: GestureResponderEvent) => {
    // Stop the event from bubbling up to the parent Card's onPress
    e.stopPropagation();
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        (isFavourite ? "Remove from favourites" : "Add to favourites")
      }
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={isFavourite ? "heart" : "heart-outline"}
        size={size}
        color={isFavourite ? primaryColors.primary : "#999"}
      />
    </TouchableOpacity>
  );
}

export const FavouriteButton = memo(FavouriteButtonBase);

const styles = StyleSheet.create({
  button: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { useCallback } from "react";
import { styled, XStack, Input } from "tamagui";
import { Search, X } from "lucide-react";
import { lightColors } from "../tokens/colors";

// Tokens used:
// color:  $surface, $textDisabled
// theme:  $borderColor, $borderColorFocus
// radius: $4 = 24px (xl)
// space:  $1 = 4, $2 = 8, $3 = 16

const SearchContainer = styled(XStack, {
  backgroundColor: "$surface",
  borderRadius: "$xl",
  borderWidth: 1,
  borderColor: "$borderColor",
  height: 48,
  alignItems: "center",
  paddingHorizontal: "$3",
  gap: "$2",

  focusStyle: {
    borderColor: "$borderColorFocus",
  },
});

const SearchField = styled(Input, {
  flex: 1,
  fontSize: "$3",
  // explicit color so web doesn't inherit a transparent/invisible value
  color: "$textPrimary",
  backgroundColor: "transparent",
  borderWidth: 0,
  placeholderTextColor: "$textDisabled",
  padding: 0,
  // remove default web outline
  outlineStyle: "none",
} as object);

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search Pokémon...",
}: SearchInputProps) {
  const iconColor = lightColors.textSecondary;

  const handleClear = useCallback(() => {
    onChangeText("");
  }, [onChangeText]);

  return (
    <SearchContainer>
      <Search size={20} color={iconColor} />
      <SearchField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search Pokémon by name or number"
      />
      {value.length > 0 && (
        <XStack
          onPress={handleClear}
          hitSlop={8}
          padding="$1"
          cursor="pointer"
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <X size={18} color={iconColor} />
        </XStack>
      )}
    </SearchContainer>
  );
}

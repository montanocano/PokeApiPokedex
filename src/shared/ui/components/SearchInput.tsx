import { useCallback } from "react";
import { styled, XStack, Input, useTheme, getTokenValue } from "tamagui";
import { Search, X } from "lucide-react";

// Tokens used:
// color:  $surface, $textDisabled
// theme:  $borderColor, $borderColorFocus, $color
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
  color: "$color",
  backgroundColor: "$transparent",
  borderWidth: 0,
  placeholderTextColor: "$textDisabled",
  padding: 0,
});

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
  // Resolve icon color from Tamagui theme instead of hardcoding
  const theme = useTheme();
  const iconColor = getTokenValue("$textSecondary", "color") as string;

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

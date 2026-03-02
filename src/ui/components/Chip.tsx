import { styled, GetProps, Text, XStack } from "tamagui";

const ChipContainer = styled(XStack, {
  paddingHorizontal: "$2",
  paddingVertical: "$1",
  borderRadius: "$sm",
  alignItems: "center",
  justifyContent: "center",
  gap: "$1",

  variants: {
    variant: {
      filled: {},
      outlined: {
        backgroundColor: "$transparent",
        borderWidth: 1,
        borderColor: "$borderColor",
      },
    },

    chipSize: {
      sm: {
        paddingHorizontal: "$2",
        paddingVertical: 2,
      },
      md: {
        paddingHorizontal: "$3",
        paddingVertical: "$1",
      },
    },

    selected: {
      true: {
        borderWidth: 2,
        borderColor: "$primary",
      },
    },

    pressable: {
      true: {
        pressStyle: { opacity: 0.8, scale: 0.95 },
        cursor: "pointer",
      },
    },
  } as const,

  defaultVariants: {
    variant: "filled",
    chipSize: "sm",
  },
});

const ChipLabel = styled(Text, {
  fontWeight: "500",

  variants: {
    chipSize: {
      sm: { fontSize: "$1" },
      md: { fontSize: "$2" },
    },
  } as const,

  defaultVariants: {
    chipSize: "sm",
  },
});

interface ChipProps {
  label: string;
  color?: string;
  textColor?: string;
  chipSize?: "sm" | "md";
  variant?: "filled" | "outlined";
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({
  label,
  color,
  textColor = "$textOnPrimary",
  chipSize = "sm",
  variant = "filled",
  selected = false,
  onPress,
}: ChipProps) {
  return (
    <ChipContainer
      variant={variant}
      chipSize={chipSize}
      selected={selected}
      pressable={!!onPress}
      onPress={onPress}
      backgroundColor={variant === "filled" ? color : "$transparent"}
      accessibilityRole="button"
      accessibilityLabel={`${label} type filter`}
      accessibilityState={{ selected }}
    >
      <ChipLabel chipSize={chipSize} color={variant === "filled" ? textColor : color}>
        {label}
      </ChipLabel>
    </ChipContainer>
  );
}
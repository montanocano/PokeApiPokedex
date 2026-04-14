import { styled, GetProps } from "tamagui";
import { YStack } from "tamagui";

export const Card = styled(YStack, {
  backgroundColor: "$surface",
  borderRadius: "$md",
  padding: "$3",
  borderWidth: 1,
  borderColor: "$borderColor",
  elevation: 3,

  variants: {
    variant: {
      default: {},
      outlined: {
        elevation: 0,
        borderWidth: 1.5,
      },
      flat: {
        elevation: 0,
        borderWidth: 0,
        backgroundColor: "$backgroundHover",
      },
    },

    pressable: {
      true: {
        pressStyle: { scale: 0.98, backgroundColor: "$backgroundHover" },
        cursor: "pointer",
      },
    },
  } as const,

  defaultVariants: {
    variant: "default",
  },
});

export type CardProps = GetProps<typeof Card>;

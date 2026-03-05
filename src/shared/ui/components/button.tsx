import { styled, GetProps } from "tamagui";
import { Button as TamaguiButton } from "tamagui";


export const Button = styled(TamaguiButton, {
  borderRadius: "$sm",
  pressStyle: { opacity: 0.85, scale: 0.97 },

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary",
        color: "$textOnPrimary",
        pressStyle: { backgroundColor: "$primaryDark", opacity: 0.85, scale: 0.97 },
      },
      secondary: {
        backgroundColor: "$transparent",
        borderWidth: 1.5,
        borderColor: "$primary",
        color: "$primary",
        pressStyle: { backgroundColor: "$primary", color: "$textOnPrimary", opacity: 0.85, scale: 0.97 },
      },
      ghost: {
        backgroundColor: "$transparent",
        color: "$primary",
        pressStyle: { backgroundColor: "$surfaceHover", opacity: 0.85, scale: 0.97 },
      },
    },

    size: {
      sm: {
        height: 36,
        paddingHorizontal: "$3",
        fontSize: "$1",
      },
      md: {
        height: 44,
        paddingHorizontal: "$4",
        fontSize: "$2",
      },
      lg: {
        height: 52,
        paddingHorizontal: "$5",
        fontSize: "$3",
      },
    },

    fullWidth: {
      true: { width: "100%" },
    },
  } as const,

  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonProps = GetProps<typeof Button>;
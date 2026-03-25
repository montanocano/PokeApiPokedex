import { YStack, Text, styled, getTokenValue } from "tamagui";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

// Tokens used:
// color:  $error (icon tint via getTokenValue)
// theme:  $color (title text)
// space:  $2 = 8, $3 = 16, $5 = 32

const ErrorContainer = styled(YStack, {
  alignItems: "center",
  justifyContent: "center",
  gap: "$3",
  padding: "$5",

  variants: {
    fullScreen: {
      true: { flex: 1 },
    },
  } as const,
});

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const errorColor = getTokenValue("$error", "color") as string;

  return (
    <ErrorContainer
      fullScreen={fullScreen}
      accessibilityRole="alert"
      accessibilityLabel={message}
    >
      <AlertTriangle size={40} color={errorColor} />

      <Text fontSize="$3" fontWeight="600" color="$color" textAlign="center">
        Oops!
      </Text>

      <Text
        fontSize="$2"
        color="$textSecondary"
        textAlign="center"
        maxWidth={280}
      >
        {message}
      </Text>

      {onRetry && (
        <Button variant="secondary" size="sm" onPress={onRetry} marginTop="$2">
          Try Again
        </Button>
      )}
    </ErrorContainer>
  );
}

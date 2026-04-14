import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { YStack, Text, styled, getTokenValue } from "tamagui";
import { Loader2 } from "lucide-react";

const Container = styled(YStack, {
  alignItems: "center",
  justifyContent: "center",
  gap: "$3",
  padding: "$4",

  variants: {
    fullScreen: {
      true: { flex: 1 },
    },
  } as const,
});

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  size = 32,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const iconColor = getTokenValue("$primary", "color") as string;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Container
      fullScreen={fullScreen}
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? "Loading"}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Loader2 size={size} color={iconColor} />
      </Animated.View>
      {message && (
        <Text fontSize="$2" color="$textSecondary">
          {message}
        </Text>
      )}
    </Container>
  );
}

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack, SplashScreen } from "expo-router";
import { TamaguiProvider, Theme } from "tamagui";
import config from "../Tamagui.config";

// Keep splash screen visible while we load fonts/config
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash once Tamagui is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? "light"}>
      <Theme name={colorScheme === "dark" ? "dark" : "light"}>
        {/* headerShown: false on all screens — each screen manages its own header */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
          <Stack.Screen
            name="[id]"
            options={{
              animation: "slide_from_right",
              gestureEnabled: true,
              fullScreenGestureEnabled: true,
            }}
          />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}

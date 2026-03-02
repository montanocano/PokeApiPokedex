import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Slot, SplashScreen } from "expo-router";
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
        <Slot />
      </Theme>
    </TamaguiProvider>
  );
}
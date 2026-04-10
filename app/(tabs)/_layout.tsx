import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  primaryColors,
  lightColors,
  darkColors,
} from "../../src/shared/ui/tokens/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkColors : lightColors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primaryColors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokédex",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

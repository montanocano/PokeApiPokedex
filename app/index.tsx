import { Redirect } from "expo-router";

// Root route: redirect to the tabs group so the tab bar is always visible
export default function Index() {
  return <Redirect href="/(tabs)" />;
}

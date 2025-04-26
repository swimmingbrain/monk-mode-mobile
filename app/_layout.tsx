import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="focusmode/FocusMode"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="friends/Friends" options={{ headerShown: false }} />
      <Stack.Screen name="profile/Profile" options={{ headerShown: false }} />
    </Stack>
  );
}

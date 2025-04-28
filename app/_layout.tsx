import { Stack, useRouter } from "expo-router";
import "./globals.css";
import { useEffect } from "react";

// TODO: Replace with actual auth check
const isAuthenticated = false;

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
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

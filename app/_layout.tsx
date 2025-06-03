import { Stack, useRouter, Slot } from "expo-router";
import "./globals.css";
import { useEffect, useState } from "react";
import { getToken } from "@/services/auth";

export default function RootLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/(auth)/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Slot />;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="focusmode/FocusMode" options={{ headerShown: false }} />
      <Stack.Screen name="tasks/createTasks"  options={{ title: "New Task" }}/>
      <Stack.Screen name="friends/Friends" options={{ headerShown: false }} />
      <Stack.Screen name="profile/Profile" options={{ headerShown: false }} />
      <Stack.Screen name="statistics/Statistics" options={{ headerShown: false }} />
    </Stack>
  );
}

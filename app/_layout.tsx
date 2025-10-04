import { Stack, useRouter, Slot, usePathname } from "expo-router";
import "./globals.css";
import { useEffect, useState } from "react";
import { getToken } from "@/services/auth";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        const isAuthRoute = pathname === "/login" || pathname === "/register";
        if (!token && !isAuthRoute) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        const isAuthRoute = pathname === "/login" || pathname === "/register";
        if (!isAuthRoute) {
          router.replace("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  if (isLoading) {
    return null;
  }

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
      <Stack.Screen
        name="statistics/Statistics"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "./loading";

function useProtectedRoute(isAuth: boolean, isLoading: boolean) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (!navigationState?.key) return;
    setIsNavigationReady(true);
  }, [navigationState?.key]);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuth && !inAuthGroup && !isLoading) {
      router.replace("/auth");
    } else if (isAuth && inAuthGroup && !isLoading) {
      router.replace("/(tabs)");
    }
  }, [isAuth, segments, isNavigationReady]);
}

function ProtectedStack() {
  const { isAuthenticated, isLoading } = useAuth();
  useProtectedRoute(isAuthenticated, isLoading);

  if (isLoading) {
    return <Loading />; // Or return a loading component
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ title: "Authentication" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedStack />
    </AuthProvider>
  );
}

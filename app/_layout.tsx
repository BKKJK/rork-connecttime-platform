import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      console.log('Auth loading...');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    console.log('Auth guard - User:', user ? user.email : 'null', 'Segments:', segments, 'InAuthGroup:', inAuthGroup);

    if (!user && !inAuthGroup) {
      // Redirect to welcome screen if not authenticated
      console.log('Redirecting to welcome screen - no user');
      router.replace('/auth/welcome');
    } else if (user && inAuthGroup) {
      // Redirect to main app if authenticated and in auth screens
      console.log('Redirecting to main app - user authenticated');
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="booking/[providerId]" options={{ headerShown: false }} />
      <Stack.Screen name="auth/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="auth/role-selection" options={{ headerShown: false }} />
      <Stack.Screen name="auth/client-setup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/provider-setup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/completion" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

import { Stack } from 'expo-router';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import QueryProvider from '@/providers/query-provider';
import './global.css';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <QueryProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>

          <Stack.Screen
            name="address-search"
            options={{
              title: '주소 검색',
              headerShown: true,
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </QueryProvider>
  );
}

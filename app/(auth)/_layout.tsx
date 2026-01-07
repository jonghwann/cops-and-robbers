import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: '번호인증' }} />
      <Stack.Screen name="sign-up" options={{ title: '회원가입' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { BACK_SCREEN_OPTIONS, BACK_SCREENS } from '@/constants/screens';
import useProfile from '@/hooks/queries/use-profile';

export default function RootNavigator() {
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useProfile();

  if (isProfileLoading || isProfileError) return <ActivityIndicator />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={profile === null}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={profile !== null}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      {BACK_SCREENS.map(({ name, options }) => (
        <Stack.Screen key={name} name={name} options={{ ...BACK_SCREEN_OPTIONS, ...options }} />
      ))}
    </Stack>
  );
}

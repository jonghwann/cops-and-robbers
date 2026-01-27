import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import RootNavigator from '@/components/navigation/root-navigator';
import QueryProvider from '@/providers/query-provider';
import SessionProvider from '@/providers/session-provider';
import './global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryProvider>
          <SessionProvider>
            <RootNavigator />
            <Toast />
          </SessionProvider>
        </QueryProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import useRegisterPushToken from '@/hooks/mutations/use-register-push-token';

const isExpoGo = Constants.appOwnership === 'expo' || Constants.appOwnership === 'guest';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  const { mutate: registerToken } = useRegisterPushToken();

  useEffect(() => {
    let notificationSub: { remove: () => void } | undefined;
    let responseSub: { remove: () => void } | undefined;

    (async () => {
      if (isExpoGo) {
        return;
      }

      const Notifications = await import('expo-notifications');

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const token = await registerForPushNotificationsAsync(Notifications);
      if (token) registerToken(token);

      notificationSub = Notifications.addNotificationReceivedListener((notification) => {});

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        const data: any = response.notification.request.content.data;
        if (data?.meetingId) router.push(`/meetings/${data.meetingId}/chat`);
      });
    })();

    return () => {
      notificationSub?.remove();
      responseSub?.remove();
    };
  }, [registerToken]);

  return <>{children}</>;
}

async function registerForPushNotificationsAsync(Notifications: any): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
  if (!projectId) {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

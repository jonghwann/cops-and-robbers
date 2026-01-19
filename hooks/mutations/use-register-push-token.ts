import { useMutation } from '@tanstack/react-query';
import { registerPushToken } from '@/api/notifications/api';

export default function useRegisterPushToken() {
  return useMutation({
    mutationFn: registerPushToken,
  });
}

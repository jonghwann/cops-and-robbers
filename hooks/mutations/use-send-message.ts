import { useMutation } from '@tanstack/react-query';
import { sendMessage } from '@/api/chat/api';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useSendMessage(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { signInWithOtp } from '@/api/auth/api';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useSignInWithOtp(callbacks?: UseMutationCallbacks) {
  return useMutation({
    mutationFn: signInWithOtp,
    onSuccess: (data) => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

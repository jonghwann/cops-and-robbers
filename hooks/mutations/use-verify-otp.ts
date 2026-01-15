import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyOtp } from '@/api/auth/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useVerifyOtp(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

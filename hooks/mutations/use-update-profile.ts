import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '@/api/auth/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useUpdateProfile(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

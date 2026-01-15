import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile, uploadProfileAvatar } from '@/api/auth/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useUploadProfileAvatar(callbacks?: UseMutationCallbacks<string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUri: string) => {
      const url = await uploadProfileAvatar(imageUri);
      await updateProfile({ avatar_url: url });
      return url;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

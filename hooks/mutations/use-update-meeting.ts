import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeeting } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useUpdateMeeting(callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMeeting,
    onSuccess: async (data) => {
      await queryClient.setQueryData(queryKeys.meetings.byId(data.id), data);
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

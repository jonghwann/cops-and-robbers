import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeeting } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { Meeting } from '@/types/meeting';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useCreateMeeting(
  region2: string,
  callbacks?: UseMutationCallbacks<Meeting>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeeting,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.list(region2) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      console.log('error', error);
      callbacks?.onError?.(error);
    },
  });
}

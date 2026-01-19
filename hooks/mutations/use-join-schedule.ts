import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinSchedule } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useJoinSchedule(meetingId: string, callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinSchedule,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.schedules(meetingId) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

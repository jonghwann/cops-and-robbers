import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveSchedule } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useLeaveSchedule(meetingId: string, callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveSchedule,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.schedules(meetingId) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

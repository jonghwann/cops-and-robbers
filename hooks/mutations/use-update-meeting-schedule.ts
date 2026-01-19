import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeetingSchedule } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useUpdateMeetingSchedule(
  meetingId: string,
  callbacks?: UseMutationCallbacks<void>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMeetingSchedule,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.schedules(meetingId) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

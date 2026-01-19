import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMeetingSchedule } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useCreateMeetingSchedule(
  meetingId: string,
  callbacks?: UseMutationCallbacks,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeetingSchedule,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.schedules(meetingId) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

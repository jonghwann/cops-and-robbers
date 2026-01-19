import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveMeeting } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useLeaveMeeting(meetingId: string, callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveMeeting,
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.meetings.byId(meetingId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.meetings.members(meetingId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.meetings.my }),
      ]);
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => callbacks?.onError?.(error),
  });
}

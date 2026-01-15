import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinMeeting } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useJoinMeeting(meetingId: string, callbacks?: UseMutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinMeeting,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.byId(meetingId) });
      callbacks?.onSuccess?.(data);
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}

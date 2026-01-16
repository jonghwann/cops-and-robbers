import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMeeting } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { UseMutationCallbacks } from '@/types/mutation';

export default function useDeleteMeeting(
  meetingId: string,
  callbacks?: UseMutationCallbacks<void>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.meetings.byId(meetingId) });
      queryClient.removeQueries({ queryKey: queryKeys.meetings.members(meetingId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all });
      callbacks?.onSuccess?.();
    },
    onError: (e) => callbacks?.onError?.(e),
  });
}

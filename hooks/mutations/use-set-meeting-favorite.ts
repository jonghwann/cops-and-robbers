import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setMeetingFavorite } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';
import type { Meeting } from '@/types/meeting';

export default function useSetMeetingFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setMeetingFavorite,

    onMutate: async ({ meetingId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.meetings.byId(meetingId) });

      const prev = queryClient.getQueryData<Meeting>(queryKeys.meetings.byId(meetingId));

      queryClient.setQueryData<Meeting>(queryKeys.meetings.byId(meetingId), (old) =>
        old ? { ...old, isFavorite } : old,
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKeys.meetings.byId(ctx.prev.id), ctx.prev);
    },
  });
}

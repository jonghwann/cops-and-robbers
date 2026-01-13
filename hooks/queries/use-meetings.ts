import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getMeetings } from '@/api/meetings/api';
import type { MeetingsCursor } from '@/api/meetings/type';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetings(region2: string) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: queryKeys.meetings.list(region2),
    initialPageParam: null as MeetingsCursor | null,
    queryFn: async ({ pageParam }) => {
      const { meetings, nextCursor, hasMore } = await getMeetings({
        region2,
        limit: 20,
        cursor: pageParam,
      });

      meetings.forEach((meeting) => {
        queryClient.setQueryData(queryKeys.meetings.byId(meeting.id), meeting);
      });

      return {
        ids: meetings.map((meeting) => meeting.id),
        nextCursor,
        hasMore,
      };
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

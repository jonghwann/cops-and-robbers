import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeetings } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetings(region2: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.meetings.list(region2),
    queryFn: async () => {
      const meetings = await getMeetings(region2);

      meetings.forEach((meeting) => {
        queryClient.setQueryData(queryKeys.meetings.byId(meeting.id), meeting);
      });

      return meetings.map((meeting) => meeting.id);
    },
  });
}

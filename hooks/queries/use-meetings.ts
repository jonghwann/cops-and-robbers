import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeetings } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetings() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.meetings.list,
    queryFn: async () => {
      const meetings = await getMeetings();

      meetings.forEach((meeting) => {
        queryClient.setQueryData(queryKeys.meetings.byId(meeting.id), meeting);
      });

      return meetings.map((meeting) => meeting.id);
    },
  });
}

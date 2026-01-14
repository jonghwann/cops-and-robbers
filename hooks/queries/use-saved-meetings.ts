import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSavedMeetings } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useSavedMeetings() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.meetings.saved,
    queryFn: async () => {
      const meetings = await getSavedMeetings();
      meetings.forEach((meeting) => {
        queryClient.setQueryData(queryKeys.meetings.byId(meeting.id), meeting);
      });
      return meetings.map((meeting) => meeting.id);
    },
  });
}

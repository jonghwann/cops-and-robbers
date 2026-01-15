import { useQuery } from '@tanstack/react-query';
import { getMyMeetings } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export function useMyMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings.my,
    queryFn: getMyMeetings,
  });
}

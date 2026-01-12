import { useQuery } from '@tanstack/react-query';
import { getMeetings } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetings() {
  return useQuery({
    queryKey: queryKeys.meetings.list,
    queryFn: getMeetings,
  });
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeetingById } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetingById(id: string, type: 'list' | 'detail') {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.meetings.byId(id),
    queryFn: () => getMeetingById(id),
    enabled: type === 'detail',
    initialData: () => queryClient.getQueryData(queryKeys.meetings.byId(id)),
  });
}

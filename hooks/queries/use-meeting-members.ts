import { useQuery } from '@tanstack/react-query';
import { getMeetingMembers } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetingMembers(meetingId: string) {
  return useQuery({
    queryKey: queryKeys.meetings.members(meetingId),
    queryFn: () => getMeetingMembers(meetingId),
    enabled: Boolean(meetingId),
  });
}

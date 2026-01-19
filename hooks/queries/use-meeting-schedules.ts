import { useQuery } from '@tanstack/react-query';
import { getMeetingSchedules } from '@/api/meetings/api';
import { queryKeys } from '@/lib/query-keys';

export default function useMeetingSchedules(meetingId: string) {
  return useQuery({
    queryKey: queryKeys.meetings.schedules(meetingId),
    queryFn: () => getMeetingSchedules(meetingId),
    enabled: Boolean(meetingId),
  });
}

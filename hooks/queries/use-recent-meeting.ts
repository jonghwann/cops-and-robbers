import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addRecentMeetingId,
  clearRecentMeetings,
  getRecentMeetingIds,
} from '@/utils/recent-meetings';

const recentKey = ['meetings', 'recent'] as const;

export function useRecentMeetings() {
  return useQuery({
    queryKey: recentKey,
    queryFn: getRecentMeetingIds,
  });
}

export function useRecentMeetingsActions() {
  const qc = useQueryClient();

  return {
    async add(id: string) {
      const next = await addRecentMeetingId(id);
      qc.setQueryData(recentKey, next);
    },
    async clear() {
      await clearRecentMeetings();
      qc.setQueryData(recentKey, []);
    },
  };
}

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/auth/api';
import { queryKeys } from '@/lib/query-keys';

export default function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: getProfile,
  });
}

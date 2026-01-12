import { useQuery } from '@tanstack/react-query';
import { searchAddress } from '@/api/kakao/api';
import { queryKeys } from '@/lib/query-keys';

export default function useSearchAddress(query: string) {
  return useQuery({
    queryKey: queryKeys.search.address(query),
    queryFn: () => searchAddress(query),
    enabled: !!query,
  });
}

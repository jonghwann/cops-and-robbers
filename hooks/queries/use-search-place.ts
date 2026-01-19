import { useInfiniteQuery } from '@tanstack/react-query';
import { searchPlace } from '@/api/kakao/api';
import { queryKeys } from '@/lib/query-keys';

export default function useSearchPlace(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.search.place(query),
    queryFn: ({ pageParam }) => searchPlace(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.isEnd) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!query,
  });
}

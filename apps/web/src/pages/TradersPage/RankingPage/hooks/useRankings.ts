import { useInfiniteQuery } from '@tanstack/react-query';

import { getRankings } from '../../apis/ranking';

const QUERY_KEY = ['rankings'] as const;

export function useRankings() {
  return useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam = 1 }) => getRankings(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? lastPage.pagination.current_page + 1
        : undefined,
    initialPageParam: 1,
  });
}

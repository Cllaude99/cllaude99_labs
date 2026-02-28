import { useQuery } from '@tanstack/react-query';

import { getQuizList } from '../apis/hint';

const QUERY_KEY = (year: number, stockId?: string) =>
  ['quiz', 'list', year, stockId] as const;

export const useQuizList = (year: number, stockId?: string) => {
  return useQuery({
    queryKey: QUERY_KEY(year, stockId),
    queryFn: () => getQuizList(year, stockId),
    enabled: !!stockId,
    staleTime: Infinity,
  });
};

import { useQuery } from '@tanstack/react-query';

import { getQuizList } from '../apis/hint';

const QUERY_KEY = (year: number) => ['quiz', 'list', year] as const;

export const useQuizList = (year: number) => {
  return useQuery({
    queryKey: QUERY_KEY(year),
    queryFn: () => getQuizList(year),
  });
};

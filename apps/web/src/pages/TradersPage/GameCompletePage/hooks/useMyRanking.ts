import { useQuery } from '@tanstack/react-query';

import { getMyRanking } from '../../apis/ranking';

const QUERY_KEY = (sessionId: string) => ['rankings', 'me', sessionId] as const;

export const useMyRanking = (
  sessionId: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? ''),
    queryFn: () => getMyRanking(sessionId!),
    enabled: !!sessionId && (options?.enabled ?? true),
  });
};

import { useQuery } from '@tanstack/react-query';

import { getLiveRankings } from '../../apis/ranking';

const LIVE_RANKING_POLL_INTERVAL_MS = 30_000;

const QUERY_KEY = (sessionId: string) =>
  ['rankings', 'live', sessionId] as const;

export const useLiveRanking = (sessionId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? ''),
    queryFn: () => getLiveRankings(sessionId!),
    enabled: !!sessionId,
    refetchInterval: LIVE_RANKING_POLL_INTERVAL_MS,
    staleTime: LIVE_RANKING_POLL_INTERVAL_MS,
  });
};

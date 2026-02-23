import { useQuery } from '@tanstack/react-query';

import { revealStockNames } from '../../apis/game';

const QUERY_KEY = (sessionId: string) => ['stockReveal', sessionId] as const;

export const useStockReveal = (sessionId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? ''),
    queryFn: () => revealStockNames(sessionId!),
    enabled: !!sessionId,
  });
};

import { useQuery } from '@tanstack/react-query';

import { getStockHistory } from '../apis/stock';

const QUERY_KEY = (sessionId: string, stockId: string) =>
  ['stock', 'history', sessionId, stockId] as const;

export const useStockHistory = (
  sessionId: string | null,
  stockId: string | null,
) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? '', stockId ?? ''),
    queryFn: () => getStockHistory(sessionId!, stockId!),
    enabled: !!sessionId && !!stockId,
  });
};

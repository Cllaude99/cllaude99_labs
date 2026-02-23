import { useQuery } from '@tanstack/react-query';

import { getStockPrices } from '../apis/stock';

const QUERY_KEY = (sessionId: string, year: number) =>
  ['stock', 'prices', sessionId, year] as const;

export const useStockPrices = (sessionId: string | null, year: number) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? '', year),
    queryFn: () => getStockPrices(sessionId!, year),
    enabled: !!sessionId,
  });
};

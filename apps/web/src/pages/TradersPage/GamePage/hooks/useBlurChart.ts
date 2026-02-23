import { useQuery } from '@tanstack/react-query';

import { getBlurPreview } from '../apis/stock';

const QUERY_KEY = (sessionId: string, year: number) =>
  ['stock', 'blur', sessionId, year] as const;

export const useBlurChart = (sessionId: string | null, year: number) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? '', year),
    queryFn: () => getBlurPreview(sessionId!, year),
    enabled: !!sessionId,
  });
};

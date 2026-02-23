import { useQuery } from '@tanstack/react-query';

import { getHints } from '../apis/hint';

const QUERY_KEY = (sessionId: string) => ['hints', sessionId] as const;

export const useHints = (sessionId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEY(sessionId ?? ''),
    queryFn: () => getHints(sessionId!),
    enabled: !!sessionId,
  });
};

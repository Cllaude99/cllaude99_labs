import { useQuery } from '@tanstack/react-query';

import { getRoomFinalRankings } from '../../apis/room';

const QUERY_KEY = (roomId: string) => ['room', 'final', roomId] as const;

export const useRoomFinalRankings = (
  roomId: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: QUERY_KEY(roomId ?? ''),
    queryFn: () => getRoomFinalRankings(roomId!),
    enabled: !!roomId && (options?.enabled ?? true),
  });
};

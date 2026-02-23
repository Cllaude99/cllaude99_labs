import { useMutation } from '@tanstack/react-query';

import { nextRound, readyRoom } from '../../apis/room';
import { useRoomStore } from '../../stores/roomStore';

export const useRoomReady = () => {
  const { roomId, participantId, setReadyState } = useRoomStore();

  return useMutation({
    mutationFn: () => {
      if (!roomId || !participantId) {
        throw new Error('방 정보가 없습니다.');
      }
      return readyRoom(roomId, participantId);
    },
    onSuccess: (data) => {
      setReadyState(data.ready_count, data.total_count);
    },
  });
};

export const useRoomNextRound = () => {
  const { roomId, participantId } = useRoomStore();

  return useMutation({
    mutationFn: () => {
      if (!roomId || !participantId) {
        throw new Error('방 정보가 없습니다.');
      }
      return nextRound(roomId, participantId);
    },
  });
};

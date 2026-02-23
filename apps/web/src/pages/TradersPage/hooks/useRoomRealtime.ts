import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

import { getRoundResult } from '../apis/room';
import type { RoomPhase, RoomStatus } from '../interfaces/room';
import { useRoomStore } from '../stores/roomStore';

export const useRoomRealtime = (roomId: string | null) => {
  const {
    setRoomStatus,
    setRoomPhase,
    setCurrentYear,
    setParticipants,
    setRoundResult,
    setIsHost,
    participantId,
  } = useRoomStore();

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const room = payload.new as {
            status: RoomStatus;
            current_phase: RoomPhase;
            current_year: number;
          };
          setRoomStatus(room.status);
          setRoomPhase(room.current_phase);
          setCurrentYear(room.current_year);

          // round_result 감지 시 결과 자동 조회
          if (room.current_phase === 'round_result') {
            getRoundResult(roomId, room.current_year).then((result) => {
              setRoundResult(result);
            });
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          // 참가자 변경 시 전체 목록 갱신
          const { data } = await supabase
            .from('room_participants')
            .select('*')
            .eq('room_id', roomId)
            .eq('status', 'active')
            .order('joined_at');

          if (data) {
            setParticipants(data);
            // 호스트 변경 감지
            if (participantId) {
              const me = data.find((p) => p.id === participantId);
              if (me) {
                setIsHost(me.is_host);
              }
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    roomId,
    participantId,
    setRoomStatus,
    setRoomPhase,
    setCurrentYear,
    setParticipants,
    setRoundResult,
    setIsHost,
  ]);
};

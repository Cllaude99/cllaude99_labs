import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

import { getRoundResult } from '../apis/room';
import type { RoomPhase, RoomStatus } from '../interfaces/room';
import { useRoomStore } from '../stores/roomStore';

interface RoomRow {
  status: RoomStatus;
  current_phase: RoomPhase;
  current_year: number;
}

function isRoomRow(value: unknown): value is RoomRow {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'current_phase' in value &&
    'current_year' in value
  );
}

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
          if (!isRoomRow(payload.new)) return;

          setRoomStatus(payload.new.status);
          setRoomPhase(payload.new.current_phase);
          setCurrentYear(payload.new.current_year);

          // round_result 감지 시 결과 자동 조회
          if (payload.new.current_phase === 'round_result') {
            getRoundResult(roomId, payload.new.current_year)
              .then((result) => {
                setRoundResult(result);
              })
              .catch((err) => {
                console.error('[useRoomRealtime] 라운드 결과 조회 실패:', err);
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
      .subscribe((status, err) => {
        if (err) {
          console.error('[useRoomRealtime] 구독 에러:', status, err);
        }
      });

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

import { supabase } from '@/lib/supabase';

import type { StockInfo } from '../interfaces/game';
import type { RoomParticipant, RoomRoundResult } from '../interfaces/room';

interface RoomCreateResponse {
  room_id: string;
  room_code: string;
  participant_id: string;
}

interface RoomJoinResponse {
  room_id: string;
  room_code: string;
  participant_id: string;
  participants: RoomParticipant[];
}

interface RoomStartResponse {
  stocks: StockInfo[];
  year: number;
  sessions: Array<{ participant_id: string; session_id: string }>;
}

export interface RoomReadyResponse {
  ready_count: number;
  total_count: number;
  all_ready: boolean;
}

export interface RoomFinalRanking {
  nickname: string;
  participant_id: string;
  final_asset: number;
  total_return_rate: number;
  rank_position: number;
}

export async function createRoom(
  nickname: string,
): Promise<RoomCreateResponse> {
  const { data, error } = await supabase.functions.invoke('room-create', {
    body: { nickname },
  });
  if (error) throw error;
  return data;
}

export async function joinRoom(
  roomCode: string,
  nickname: string,
): Promise<RoomJoinResponse> {
  const { data, error } = await supabase.functions.invoke('room-join', {
    body: { room_code: roomCode, nickname },
  });
  if (error) throw error;
  return data;
}

export async function startRoom(
  roomId: string,
  participantId: string,
): Promise<RoomStartResponse> {
  const { data, error } = await supabase.functions.invoke('room-start', {
    body: { room_id: roomId, participant_id: participantId },
  });
  if (error) throw error;
  return data;
}

export async function readyRoom(
  roomId: string,
  participantId: string,
): Promise<RoomReadyResponse> {
  const { data, error } = await supabase.functions.invoke('room-ready', {
    body: { room_id: roomId, participant_id: participantId },
  });
  if (error) throw error;
  return data;
}

export async function getRoundResult(
  roomId: string,
  year: number,
): Promise<RoomRoundResult> {
  const { data, error } = await supabase.functions.invoke(
    'room-round-result',
    {
      body: { room_id: roomId, year },
    },
  );
  if (error) throw error;
  return data;
}

export async function nextRound(
  roomId: string,
  participantId: string,
): Promise<{ year: number; is_completed: boolean }> {
  const { data, error } = await supabase.functions.invoke('room-next-round', {
    body: { room_id: roomId, participant_id: participantId },
  });
  if (error) throw error;
  return data;
}

export async function leaveRoom(
  roomId: string,
  participantId: string,
): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke('room-leave', {
    body: { room_id: roomId, participant_id: participantId },
  });
  if (error) throw error;
  return data;
}

export async function getRoomFinalRankings(
  roomId: string,
): Promise<RoomFinalRanking[]> {
  const { data, error } = await supabase.rpc('get_room_final_rankings', {
    p_room_id: roomId,
  });
  if (error) throw error;
  return (data ?? []).map(
    (entry: Omit<RoomFinalRanking, 'rank_position'>, idx: number) => ({
      ...entry,
      rank_position: idx + 1,
    }),
  );
}

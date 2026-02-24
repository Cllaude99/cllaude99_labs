import { invokeFunction, invokeRpc } from './utils';
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
  return invokeFunction<RoomCreateResponse>('room-create', { nickname });
}

export async function joinRoom(
  roomCode: string,
  nickname: string,
): Promise<RoomJoinResponse> {
  return invokeFunction<RoomJoinResponse>('room-join', {
    room_code: roomCode,
    nickname,
  });
}

export async function startRoom(
  roomId: string,
  participantId: string,
): Promise<RoomStartResponse> {
  return invokeFunction<RoomStartResponse>('room-start', {
    room_id: roomId,
    participant_id: participantId,
  });
}

export async function readyRoom(
  roomId: string,
  participantId: string,
): Promise<RoomReadyResponse> {
  return invokeFunction<RoomReadyResponse>('room-ready', {
    room_id: roomId,
    participant_id: participantId,
  });
}

export async function getRoundResult(
  roomId: string,
  year: number,
): Promise<RoomRoundResult> {
  return invokeFunction<RoomRoundResult>('room-round-result', {
    room_id: roomId,
    year,
  });
}

export async function nextRound(
  roomId: string,
  participantId: string,
): Promise<{ year: number; is_completed: boolean }> {
  return invokeFunction<{ year: number; is_completed: boolean }>(
    'room-next-round',
    {
      room_id: roomId,
      participant_id: participantId,
    },
  );
}

export async function leaveRoom(
  roomId: string,
  participantId: string,
): Promise<{ success: boolean }> {
  return invokeFunction<{ success: boolean }>('room-leave', {
    room_id: roomId,
    participant_id: participantId,
  });
}

export async function getRoomFinalRankings(
  roomId: string,
): Promise<RoomFinalRanking[]> {
  const data = await invokeRpc<Omit<RoomFinalRanking, 'rank_position'>[] | null>(
    'get_room_final_rankings',
    { p_room_id: roomId },
  );
  return (data ?? []).map((entry, idx) => ({
    ...entry,
    rank_position: idx + 1,
  }));
}

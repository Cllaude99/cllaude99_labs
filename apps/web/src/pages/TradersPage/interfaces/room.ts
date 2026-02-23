import type { EnhancedSettlementResult } from './game';

export type RoomStatus = 'waiting' | 'playing' | 'completed';
export type RoomPhase = 'waiting_start' | 'hint' | 'trading' | 'round_result';

export interface RoomParticipant {
  id: string;
  room_id: string;
  nickname: string;
  session_id: string | null;
  is_host: boolean;
  is_ready: boolean;
  status: 'active' | 'disconnected' | 'left';
  joined_at: string;
}

export interface RoomRoundRanking {
  nickname: string;
  participant_id: string;
  ending_asset: number;
  return_rate: number;
  rank: number;
  settlement: EnhancedSettlementResult | null;
}

export interface RoomRoundResult {
  year: number;
  rankings: RoomRoundRanking[];
  is_game_completed: boolean;
}

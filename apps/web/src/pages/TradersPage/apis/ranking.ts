import { invokeFunction } from './utils';

export interface RankingEntry {
  rank_position: number;
  nickname: string;
  avatar_url: string | null;
  final_asset: number;
  total_return_rate: number;
  total_trades: number;
  completed_at: string;
}

interface RankingPagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
}

export interface RankingsResponse {
  rankings: RankingEntry[];
  pagination: RankingPagination;
}

export interface MyRankingResponse {
  rank_position: number;
  nickname: string;
  final_asset: number;
  total_return_rate: number;
  total_trades: number;
  yearly_summary: Array<{
    year: number;
    starting_asset: number;
    ending_asset: number;
    return_rate: number;
  }>;
  top_trades: Array<{
    stock_alias_code: string;
    category: string;
    trade_type: string;
    profit: number;
    return_rate: number;
  }>;
}

export interface LiveRankingEntry {
  nickname: string;
  avatar_url: string | null;
  total_asset: number;
  return_rate: number;
  current_year: number;
  rank_position: number;
}

export interface LiveRankingsResponse {
  my_rank: number;
  my_return_rate: number;
  total_players: number;
  top_players: LiveRankingEntry[];
  nearby_players: LiveRankingEntry[];
}

export async function getRankings(page: number, limit: number = 20): Promise<RankingsResponse> {
  return invokeFunction<RankingsResponse>('rankings', { page, limit });
}

export async function getMyRanking(sessionId: string): Promise<MyRankingResponse> {
  return invokeFunction<MyRankingResponse>('rankings-me', {
    session_id: sessionId,
  });
}

export async function getLiveRankings(sessionId: string): Promise<LiveRankingsResponse> {
  return invokeFunction<LiveRankingsResponse>('rankings-live', {
    session_id: sessionId,
  });
}

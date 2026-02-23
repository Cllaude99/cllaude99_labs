import { supabase } from '@/lib/supabase';

import type { AdvanceYearResponse, StockInfo } from '../interfaces/game';
import type { RevealedStock } from '../interfaces/stock';

type GameStatus = 'playing' | 'settling' | 'completed' | 'abandoned';

export interface GameCreateResponse {
  session_id: string;
  current_year: number;
  current_month: number;
  cash_balance: number;
  total_asset: number;
  status: GameStatus;
  stocks: StockInfo[];
}

export async function createGame(nickname?: string): Promise<GameCreateResponse> {
  const { data, error } = await supabase.functions.invoke('game-create', {
    body: nickname ? { nickname } : {},
  });
  if (error) throw error;
  return data;
}

export async function advanceYear(sessionId: string): Promise<AdvanceYearResponse> {
  const { data, error } = await supabase.functions.invoke('game-advance-year', {
    body: { session_id: sessionId },
  });
  if (error) throw error;
  return data;
}

export async function revealStockNames(
  sessionId: string,
): Promise<RevealedStock[]> {
  const { data, error } = await supabase.rpc('reveal_stock_names', {
    p_session_id: sessionId,
  });
  if (error) throw error;
  return data ?? [];
}

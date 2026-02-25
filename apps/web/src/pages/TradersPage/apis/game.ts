import { invokeFunction, invokeRpc } from './utils';
import type { AdvanceYearResponse, StockInfo } from '../interfaces/game';
import type { RevealedStock } from '../interfaces/stock';

export interface GameCreateResponse {
  session_id: string;
  current_year: number;
  current_month: number;
  cash_balance: number;
  total_asset: number;
  stocks: StockInfo[];
}

export async function createGame(nickname?: string): Promise<GameCreateResponse> {
  return invokeFunction<GameCreateResponse>(
    'game-create',
    nickname ? { nickname } : {},
  );
}

export async function advanceYear(sessionId: string): Promise<AdvanceYearResponse> {
  return invokeFunction<AdvanceYearResponse>('game-advance-year', {
    session_id: sessionId,
  });
}

export async function revealStockNames(
  sessionId: string,
): Promise<RevealedStock[]> {
  const data = await invokeRpc<RevealedStock[] | null>('reveal_stock_names', {
    p_session_id: sessionId,
  });
  return data ?? [];
}

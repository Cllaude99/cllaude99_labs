import { invokeFunction } from '../../apis/utils';
import type { TradeType, UpdatedHolding } from '../../interfaces/trade';

interface TradeExecuteRequest {
  session_id: string;
  stock_id: string;
  trade_type: TradeType;
  quantity: number;
}

interface TradeResult {
  id: string;
  stock_id: string;
  alias_code: string;
  trade_type: TradeType;
  quantity: number;
  price: number;
  total_amount: number;
}

export interface TradeExecuteResponse {
  trade: TradeResult;
  updated_balance: {
    cash_balance: number;
    total_asset: number;
  };
  updated_holding: UpdatedHolding | null;
}

export async function executeTrade(
  params: TradeExecuteRequest,
): Promise<TradeExecuteResponse> {
  return invokeFunction<TradeExecuteResponse>('trade-execute', params);
}

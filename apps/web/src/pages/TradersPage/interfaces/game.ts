export type GamePhase = 'hint' | 'trading' | 'settlement';

export type GameStatus = 'playing' | 'settling' | 'completed' | 'abandoned';

export interface StockInfo {
  stock_id: string;
  alias_code: string;
  category: string;
}

export interface PortfolioItem {
  stock_id: string;
  alias_code: string;
  category: string;
  quantity: number;
  avg_buy_price: number;
  total_invested: number;
  current_price: number;
  unrealized_pnl: number;
  return_rate: number;
}

export interface SettlementResult {
  year: number;
  starting_asset: number;
  ending_asset: number;
  return_rate: number;
  total_trades: number;
}

export interface StockYearlyPerformance {
  stock_id: string;
  alias_code: string;
  category: string;
  total_buy_amount: number;
  total_sell_amount: number;
  avg_buy_price: number;
  year_end_price: number;
  held_quantity: number;
  realized_pnl: number;
  return_rate: number;
}

export interface EnhancedSettlementResult extends SettlementResult {
  stock_performances: StockYearlyPerformance[];
}

export interface AdvanceYearResponse {
  settlement: EnhancedSettlementResult;
  next_year: {
    year: number;
    cash_balance: number;
  };
  is_game_completed: boolean;
}

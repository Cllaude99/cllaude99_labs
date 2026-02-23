export type TradeType = 'buy' | 'sell';

export interface UpdatedHolding {
  stock_id: string;
  quantity: number;
  avg_buy_price: number;
}

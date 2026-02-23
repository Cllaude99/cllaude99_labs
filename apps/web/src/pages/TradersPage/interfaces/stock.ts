export interface StockDailyPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change_rate: number;
}

export interface BlurChartData {
  year: number;
  is_unlocked: boolean;
  preview_months: number[];
  description: string;
  preview_data: Array<{
    stock_id: string;
    alias_code: string;
    daily_closes: Array<{
      date: string;
      close: number;
    }>;
  }> | null;
}

export interface RevealedStock {
  alias_code: string;
  real_name: string;
  category: string;
}

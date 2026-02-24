import { invokeFunction } from '../../apis/utils';
import type { BlurChartData, StockDailyPrice } from '../../interfaces/stock';

interface StockPriceData {
  stock_id: string;
  alias_code: string;
  category: string;
  prices: StockDailyPrice[];
}

export interface StockPricesResponse {
  year: number;
  stocks: StockPriceData[];
}

interface MonthlyPrice {
  year: number;
  month: number;
  close: number;
  change_rate: number;
}

export interface StockHistoryResponse {
  stock_id: string;
  alias_code: string;
  category: string;
  monthly_prices: MonthlyPrice[];
}

export async function getStockPrices(sessionId: string, year: number): Promise<StockPricesResponse> {
  return invokeFunction<StockPricesResponse>('stock-prices', {
    session_id: sessionId,
    year,
  });
}

export async function getStockHistory(sessionId: string, stockId: string): Promise<StockHistoryResponse> {
  return invokeFunction<StockHistoryResponse>('stock-history', {
    session_id: sessionId,
    stock_id: stockId,
  });
}

export async function getBlurPreview(sessionId: string, year: number): Promise<BlurChartData> {
  return invokeFunction<BlurChartData>('stock-blur-preview', {
    session_id: sessionId,
    year,
  });
}

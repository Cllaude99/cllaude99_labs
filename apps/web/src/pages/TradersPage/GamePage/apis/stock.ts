import { supabase } from '@/lib/supabase';

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
  const { data, error } = await supabase.functions.invoke('stock-prices', {
    body: { session_id: sessionId, year },
  });
  if (error) throw error;
  return data;
}

export async function getStockHistory(sessionId: string, stockId: string): Promise<StockHistoryResponse> {
  const { data, error } = await supabase.functions.invoke('stock-history', {
    body: { session_id: sessionId, stock_id: stockId },
  });
  if (error) throw error;
  return data;
}

export async function getBlurPreview(sessionId: string, year: number): Promise<BlurChartData> {
  const { data, error } = await supabase.functions.invoke('stock-blur-preview', {
    body: { session_id: sessionId, year },
  });
  if (error) throw error;
  return data;
}

import type { StockDailyPrice } from '../../interfaces/stock';

/**
 * 해당 연도 첫 번째 거래일 종가 (연초 가격)
 */
export function getYearStartPrice(prices: StockDailyPrice[]): number {
  if (prices.length === 0) return 0;
  return prices[0].close;
}

/**
 * 해당 연도 마지막 거래일 종가 (연말 가격)
 */
export function getYearEndPrice(prices: StockDailyPrice[]): number {
  if (prices.length === 0) return 0;
  return prices[prices.length - 1].close;
}

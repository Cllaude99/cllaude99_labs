import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { GamePhase } from '../constants/game';
import type { EnhancedSettlementResult, PortfolioItem, StockInfo } from '../interfaces/game';
import type { UpdatedHolding } from '../interfaces/trade';

interface GameState {
  sessionId: string | null;
  currentYear: number;
  phase: GamePhase;
  cashBalance: number;
  totalAsset: number;
  stocks: StockInfo[];
  portfolio: PortfolioItem[];
  settlementHistory: EnhancedSettlementResult[];
}

interface GameActions {
  setSession: (sessionId: string, stocks: StockInfo[]) => void;
  updateBalance: (cashBalance: number, totalAsset: number) => void;
  updatePortfolio: (portfolio: PortfolioItem[]) => void;
  setPhase: (phase: GamePhase) => void;
  advanceYear: (year: number, cashBalance: number) => void;
  upsertHolding: (stockId: string, updatedHolding: UpdatedHolding | null) => void;
  addSettlement: (settlement: EnhancedSettlementResult) => void;
  reset: () => void;
}

const initialState: GameState = {
  sessionId: null,
  currentYear: 2010,
  phase: 'hint',
  cashBalance: 10_000_000,
  totalAsset: 10_000_000,
  stocks: [],
  portfolio: [],
  settlementHistory: [],
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      setSession: (sessionId, stocks) =>
        set({ sessionId, stocks }),

      updateBalance: (cashBalance, totalAsset) =>
        set({ cashBalance, totalAsset }),

      updatePortfolio: (portfolio) =>
        set({ portfolio }),

      setPhase: (phase) =>
        set({ phase }),

      advanceYear: (year, cashBalance) =>
        set({
          currentYear: year,
          phase: 'hint',
          cashBalance,
          totalAsset: cashBalance,
          portfolio: [],
        }),

      upsertHolding: (stockId, updatedHolding) =>
        set((state) => {
          if (!updatedHolding) {
            return {
              portfolio: state.portfolio.filter((p) => p.stock_id !== stockId),
            };
          }

          const existingIndex = state.portfolio.findIndex(
            (p) => p.stock_id === stockId,
          );

          if (existingIndex >= 0) {
            const updated = [...state.portfolio];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updatedHolding.quantity,
              avg_buy_price: updatedHolding.avg_buy_price,
            };
            return { portfolio: updated };
          }

          const stockInfo = state.stocks.find((s) => s.stock_id === stockId);
          const newItem: PortfolioItem = {
            stock_id: stockId,
            alias_code: stockInfo?.alias_code ?? '',
            category: stockInfo?.category ?? '',
            quantity: updatedHolding.quantity,
            avg_buy_price: updatedHolding.avg_buy_price,
            total_invested: updatedHolding.quantity * updatedHolding.avg_buy_price,
            current_price: 0,
            unrealized_pnl: 0,
            return_rate: 0,
          };
          return { portfolio: [...state.portfolio, newItem] };
        }),

      addSettlement: (settlement) =>
        set((state) => ({
          settlementHistory: [...state.settlementHistory, settlement],
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'traders-game',
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2) {
          const old = persisted as Record<string, unknown>;
          return {
            ...old,
            phase: 'hint' as GamePhase,
          };
        }
        return persisted as GameState & GameActions;
      },
      partialize: (state) => ({
        sessionId: state.sessionId,
        stocks: state.stocks,
        currentYear: state.currentYear,
        phase: state.phase,
        cashBalance: state.cashBalance,
        totalAsset: state.totalAsset,
        portfolio: state.portfolio,
        settlementHistory: state.settlementHistory,
      }),
    },
  ),
);

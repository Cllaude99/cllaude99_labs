import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TradeType } from '../../interfaces/trade';
import { useGameStore } from '../../stores/gameStore';
import { executeTrade } from '../apis/trade';

const GAME_STATE_QUERY_KEY = (sessionId: string) =>
  ['game', 'state', sessionId] as const;

interface UseTradeParams {
  sessionId: string;
  stockId: string;
  tradeType: TradeType;
}

export const useTrade = ({
  sessionId,
  stockId,
  tradeType,
}: UseTradeParams) => {
  const queryClient = useQueryClient();
  const { updateBalance } = useGameStore();

  return useMutation({
    mutationFn: (quantity: number) =>
      executeTrade({
        session_id: sessionId,
        stock_id: stockId,
        trade_type: tradeType,
        quantity,
      }),
    onSuccess: (data) => {
      updateBalance(
        data.updated_balance.cash_balance,
        data.updated_balance.total_asset,
      );
      queryClient.invalidateQueries({
        queryKey: GAME_STATE_QUERY_KEY(sessionId),
      });
    },
  });
};

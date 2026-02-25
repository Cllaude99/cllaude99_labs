import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { PATH } from '@/constants';

import { useRoomNextRound, useRoomReady } from './useRoomGame';
import { useStockHistory } from './useStockHistory';
import { useStockPrices } from './useStockPrices';
import { useTrade } from './useTrade';
import { advanceYear } from '../../apis/game';
import { START_YEAR, STORAGE_KEY_TUTORIAL_DONE } from '../../constants/game';
import { useRoomRealtime } from '../../hooks/useRoomRealtime';
import type { AdvanceYearResponse, PortfolioItem, StockInfo } from '../../interfaces/game';
import type { StockDailyPrice } from '../../interfaces/stock';
import type { TradeType } from '../../interfaces/trade';
import { useGameStore } from '../../stores/gameStore';
import { useRoomStore } from '../../stores/roomStore';
import { getYearEndPrice, getYearStartPrice } from '../utils/priceUtils';

export const useGamePageLogic = () => {
  const navigate = useNavigate();
  const {
    sessionId,
    currentYear,
    phase,
    cashBalance,
    totalAsset,
    stocks,
    portfolio,
    setPhase,
    setSession,
    advanceYear: advanceYearStore,
    upsertHolding,
    addSettlement,
  } = useGameStore();

  // 방 모드 상태
  const {
    roomId,
    participantId,
    isHost,
    participants,
    roomPhase,
    roundResult,
  } = useRoomStore();
  const setRoundResult = useRoomStore((s) => s.setRoundResult);
  const isRoomMode = !!roomId;

  // Realtime 구독 (방 모드 시)
  useRoomRealtime(isRoomMode ? roomId : null);

  // 방 모드 훅
  const roomReadyMutation = useRoomReady();
  const roomNextRoundMutation = useRoomNextRound();

  // 방 모드: 라운드 결과 → 다음 라운드 감지 시 결산 화면 닫기
  const [showRoomWaiting, setShowRoomWaiting] = useState(false);

  const [isHydrated, setIsHydrated] = useState(() =>
    useGameStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsub = useGameStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isHydrated && !sessionId) {
      navigate(PATH.TRADERS, { replace: true });
    }
  }, [isHydrated, sessionId, navigate]);

  // 방 모드: roomPhase가 hint로 바뀌면 다음 라운드 시작
  useEffect(() => {
    if (!isRoomMode) return;
    if (roomPhase === 'hint') {
      setRoundResult(null);
      setShowRoomWaiting(false);
      setPhase('hint');
    }
  }, [isRoomMode, roomPhase, setRoundResult, setPhase]);

  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [tradePanel, setTradePanel] = useState<{
    open: boolean;
    type: TradeType;
  }>({ open: false, type: 'buy' });
  const [settlementData, setSettlementData] =
    useState<AdvanceYearResponse | null>(null);
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY_TUTORIAL_DONE);
  });

  // 현재 연도 주가 데이터
  const { data: stockPricesData } = useStockPrices(sessionId, currentYear);

  // 게스트 모드: stocks가 비어있을 때 stockPricesData에서 복원
  useEffect(() => {
    if (sessionId && stocks.length === 0 && stockPricesData?.stocks) {
      const derivedStocks: StockInfo[] = stockPricesData.stocks.map((s) => ({
        stock_id: s.stock_id,
        alias_code: s.alias_code,
        category: s.category,
      }));
      if (derivedStocks.length > 0) {
        setSession(sessionId, derivedStocks);
      }
    }
  }, [sessionId, stocks.length, stockPricesData, setSession]);

  // 전년도 주가 데이터 (변동률 계산용)
  const { data: prevYearPricesData } = useStockPrices(
    currentYear > START_YEAR ? sessionId : null,
    currentYear - 1,
  );

  // 선택된 종목의 이전 연도 차트 (stock-history API)
  const { data: stockHistoryData } = useStockHistory(
    sessionId,
    selectedStockId,
  );

  // 모든 종목의 연초 가격
  const yearStartPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    if (!stockPricesData?.stocks) return prices;
    for (const stock of stockPricesData.stocks) {
      prices[stock.stock_id] = getYearStartPrice(stock.prices);
    }
    return prices;
  }, [stockPricesData]);

  // 상장된 종목만 필터링 (가격이 0보다 큰 종목)
  const listedStocks = useMemo(
    () => stocks.filter((s) => yearStartPrices[s.stock_id] > 0),
    [stocks, yearStartPrices],
  );

  // yearStartPrices가 로드되면 상장된 첫 종목을 자동 선택
  useEffect(() => {
    if (listedStocks.length === 0) return;

    if (
      !selectedStockId ||
      !yearStartPrices[selectedStockId] ||
      yearStartPrices[selectedStockId] === 0
    ) {
      setSelectedStockId(listedStocks[0].stock_id);
    }
  }, [yearStartPrices, selectedStockId, listedStocks]);

  // 전년도 말 가격
  const prevYearEndPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    if (!prevYearPricesData?.stocks) return prices;
    for (const stock of prevYearPricesData.stocks) {
      prices[stock.stock_id] = getYearEndPrice(stock.prices);
    }
    return prices;
  }, [prevYearPricesData]);

  // 이전 연도 누적 차트 데이터 (월봉, currentYear 이전만)
  const chartPrices = useMemo((): StockDailyPrice[] => {
    if (!stockHistoryData?.monthly_prices) return [];
    return stockHistoryData.monthly_prices
      .filter((mp) => mp.year < currentYear)
      .map((mp) => ({
        date: `${mp.year}-${String(mp.month).padStart(2, '0')}-01`,
        open: mp.close,
        high: mp.close,
        low: mp.close,
        close: mp.close,
        volume: 0,
        change_rate: mp.change_rate,
      }));
  }, [stockHistoryData, currentYear]);

  const currentSelectedPrice = selectedStockId
    ? (yearStartPrices[selectedStockId] ?? 0)
    : 0;

  const selectedStock = stocks.find((s) => s.stock_id === selectedStockId);
  const selectedHolding = portfolio.find((p) => p.stock_id === selectedStockId);

  const maxBuyQuantity =
    currentSelectedPrice > 0
      ? Math.floor(cashBalance / currentSelectedPrice)
      : 0;

  // 포트폴리오 enrichment
  const enrichedPortfolio = useMemo((): PortfolioItem[] => {
    return portfolio.map((item) => {
      const currentPrice = yearStartPrices[item.stock_id] ?? 0;
      const unrealizedPnl = (currentPrice - item.avg_buy_price) * item.quantity;
      const returnRate =
        item.avg_buy_price > 0
          ? ((currentPrice - item.avg_buy_price) / item.avg_buy_price) * 100
          : 0;
      return {
        ...item,
        current_price: currentPrice,
        unrealized_pnl: unrealizedPnl,
        return_rate: returnRate,
      };
    });
  }, [portfolio, yearStartPrices]);

  const tradeMutation = useTrade({
    sessionId: sessionId ?? '',
    stockId: selectedStockId ?? '',
    tradeType: tradePanel.type,
  });

  const advanceYearMutation = useMutation({
    mutationFn: () => advanceYear(sessionId!),
    onSuccess: (data: AdvanceYearResponse) => {
      addSettlement(data.settlement);
      setSettlementData(data);
      setPhase('settlement');
    },
  });

  const handleTradeSubmit = useCallback(
    (quantity: number) => {
      if (!selectedStockId) return;
      tradeMutation.mutate(quantity, {
        onSuccess: (data) => {
          upsertHolding(selectedStockId, data.updated_holding);
          setTradePanel({ open: false, type: 'buy' });
        },
      });
    },
    [selectedStockId, tradeMutation, upsertHolding],
  );

  const handleHintComplete = useCallback(() => {
    setPhase('trading');
  }, [setPhase]);

  const handleTutorialComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_TUTORIAL_DONE, 'true');
    setShowTutorial(false);
  }, []);

  const handleInvestComplete = useCallback(() => {
    if (isRoomMode) {
      roomReadyMutation.mutate(undefined, {
        onSuccess: () => {
          setShowRoomWaiting(true);
        },
      });
    } else {
      advanceYearMutation.mutate();
    }
  }, [isRoomMode, roomReadyMutation, advanceYearMutation]);

  const handleSettlementNext = useCallback(() => {
    if (!settlementData) return;
    if (settlementData.is_game_completed) {
      navigate(PATH.TRADERS_GAME_COMPLETE);
      return;
    }
    advanceYearStore(
      settlementData.next_year.year,
      settlementData.next_year.cash_balance,
    );
    setSettlementData(null);
  }, [settlementData, advanceYearStore, navigate]);

  const handleRoomNextRound = useCallback(() => {
    if (!isHost) return;
    if (roundResult?.is_game_completed) {
      navigate(PATH.TRADERS_GAME_COMPLETE);
      return;
    }
    roomNextRoundMutation.mutate();
  }, [isHost, roundResult, roomNextRoundMutation, navigate]);

  const openTradePanel = useCallback((type: TradeType) => {
    setTradePanel({ open: true, type });
  }, []);

  const closeTradePanel = useCallback(() => {
    setTradePanel({ open: false, type: 'buy' });
  }, []);

  return {
    // 상태
    sessionId,
    currentYear,
    phase,
    cashBalance,
    totalAsset,
    stocks,
    isHydrated,
    isRoomMode,
    isHost,
    participants,
    roomPhase,
    roundResult,
    participantId,
    showRoomWaiting,
    showTutorial,
    selectedStockId,
    tradePanel,
    settlementData,

    // 계산된 값
    stockPricesData,
    listedStocks,
    yearStartPrices,
    prevYearEndPrices,
    chartPrices,
    currentSelectedPrice,
    selectedStock,
    selectedHolding,
    maxBuyQuantity,
    enrichedPortfolio,

    // 뮤테이션 상태
    tradeMutationIsPending: tradeMutation.isPending,
    advanceYearMutationIsPending: advanceYearMutation.isPending,
    roomReadyMutationIsPending: roomReadyMutation.isPending,
    roomNextRoundMutationIsPending: roomNextRoundMutation.isPending,

    // 핸들러
    setSelectedStockId,
    openTradePanel,
    closeTradePanel,
    handleTradeSubmit,
    handleHintComplete,
    handleTutorialComplete,
    handleInvestComplete,
    handleSettlementNext,
    handleRoomNextRound,
  };
};

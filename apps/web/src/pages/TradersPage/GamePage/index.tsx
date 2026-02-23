import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { PATH } from '@/constants';

import * as S from './GamePage.styles';
import { advanceYear } from '../apis/game';
import EnhancedSettlement from './components/EnhancedSettlement';
import GameTutorial from './components/GameTutorial';
import HintPhase from './components/HintPhase';
import LiveRanking from './components/LiveRanking';
import PortfolioDashboard from './components/PortfolioDashboard';
import RoundResult from './components/RoundResult';
import StockChart from './components/StockChart';
import StockList from './components/StockList';
import TradeForm from './components/TradeForm';
import WaitingOverlay from './components/WaitingOverlay';
import YearTimeline from './components/YearTimeline';
import { START_YEAR } from '../constants/game';
import { useRoomRealtime } from '../hooks/useRoomRealtime';
import type { AdvanceYearResponse, PortfolioItem } from '../interfaces/game';
import type { StockDailyPrice } from '../interfaces/stock';
import type { TradeType } from '../interfaces/trade';
import { useGameStore } from '../stores/gameStore';
import { useRoomStore } from '../stores/roomStore';
import { useRoomNextRound, useRoomReady } from './hooks/useRoomGame';
import { useStockHistory } from './hooks/useStockHistory';
import { useStockPrices } from './hooks/useStockPrices';
import { useTrade } from './hooks/useTrade';
import { getYearEndPrice, getYearStartPrice } from './utils/priceUtils';

const GamePage = () => {
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
    readyCount,
    totalCount,
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
    return !localStorage.getItem('traders_tutorial_done');
  });

  // 현재 연도 주가 데이터
  const { data: stockPricesData } = useStockPrices(sessionId, currentYear);

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
    localStorage.setItem('traders_tutorial_done', 'true');
    setShowTutorial(false);
  }, []);

  const handleInvestComplete = useCallback(() => {
    if (isRoomMode) {
      // 방 모드: 투자 완료 신호 전송 + 대기 오버레이 표시
      roomReadyMutation.mutate(undefined, {
        onSuccess: () => {
          setShowRoomWaiting(true);
        },
      });
    } else {
      // 솔로 모드: 기존 로직
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

  if (!isHydrated || !sessionId || stocks.length === 0) {
    return <S.LoadingContainer>게임을 로딩 중입니다...</S.LoadingContainer>;
  }

  if (showTutorial) {
    return <GameTutorial onComplete={handleTutorialComplete} />;
  }

  if (phase === 'hint') {
    return (
      <HintPhase
        sessionId={sessionId}
        year={currentYear}
        onComplete={handleHintComplete}
      />
    );
  }

  // 솔로 모드: 기존 결산 화면
  if (!isRoomMode && phase === 'settlement' && settlementData) {
    return (
      <S.Container>
        <S.TopBar>
          <YearTimeline currentYear={currentYear} />
        </S.TopBar>
        <S.BottomSection>
          <EnhancedSettlement
            settlement={settlementData.settlement}
            isGameCompleted={settlementData.is_game_completed}
            onNext={handleSettlementNext}
          />
        </S.BottomSection>
      </S.Container>
    );
  }

  // 방 모드: 라운드 결과 표시
  if (isRoomMode && roomPhase === 'round_result' && roundResult) {
    return (
      <S.Container>
        <S.TopBar>
          <YearTimeline currentYear={currentYear} />
        </S.TopBar>
        <S.BottomSection>
          <RoundResult
            year={roundResult.year}
            rankings={roundResult.rankings}
            isHost={isHost}
            isGameCompleted={roundResult.is_game_completed}
            myParticipantId={participantId ?? ''}
            onNext={handleRoomNextRound}
            isPending={roomNextRoundMutation.isPending}
          />
        </S.BottomSection>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.TopBar>
        <S.YearMonth>{currentYear}년</S.YearMonth>
        <S.TopBarRight>
          <LiveRanking sessionId={sessionId} />
          <S.TotalAsset>{totalAsset.toLocaleString()}원</S.TotalAsset>
        </S.TopBarRight>
      </S.TopBar>

      <YearTimeline currentYear={currentYear} />

      <StockList
        stocks={!stockPricesData ? stocks : listedStocks}
        selectedStockId={selectedStockId}
        onSelect={setSelectedStockId}
        currentPrices={yearStartPrices}
        prevYearEndPrices={prevYearEndPrices}
        isLoading={!stockPricesData}
      />

      <S.ChartSection>
        {chartPrices.length > 0 ? (
          <StockChart prices={chartPrices} height={280} />
        ) : (
          <S.EmptyChartMessage>
            {currentYear === START_YEAR
              ? '첫 해에는 이전 연도 차트가 없습니다'
              : '차트 데이터를 불러오는 중...'}
          </S.EmptyChartMessage>
        )}
      </S.ChartSection>

      <S.BottomSection>
        <S.PhaseLabel>
          종목을 선택하고 매수/매도하세요. 완료되면 투자 완료를 눌러주세요.
        </S.PhaseLabel>

        <S.TradeActions>
          <S.TradeButton
            variant="buy"
            disabled={!selectedStockId || currentSelectedPrice === 0}
            onClick={() => setTradePanel({ open: true, type: 'buy' })}
          >
            매수
          </S.TradeButton>
          <S.TradeButton
            variant="sell"
            disabled={!selectedHolding || selectedHolding.quantity === 0}
            onClick={() => setTradePanel({ open: true, type: 'sell' })}
          >
            매도
          </S.TradeButton>
        </S.TradeActions>

        <S.InvestCompleteButton
          onClick={handleInvestComplete}
          disabled={
            isRoomMode
              ? roomReadyMutation.isPending || showRoomWaiting
              : advanceYearMutation.isPending
          }
        >
          {isRoomMode
            ? roomReadyMutation.isPending
              ? '전송 중...'
              : showRoomWaiting
                ? '대기 중...'
                : '투자 완료'
            : advanceYearMutation.isPending
              ? '결산 중...'
              : '투자 완료'}
        </S.InvestCompleteButton>

        <PortfolioDashboard
          cashBalance={cashBalance}
          totalAsset={totalAsset}
          portfolio={enrichedPortfolio}
        />
      </S.BottomSection>

      {tradePanel.open && selectedStock && (
        <S.TradeOverlay
          onClick={() => setTradePanel({ open: false, type: 'buy' })}
        >
          <S.TradePanel onClick={(e) => e.stopPropagation()}>
            <TradeForm
              tradeType={tradePanel.type}
              currentPrice={currentSelectedPrice}
              maxQuantity={
                tradePanel.type === 'buy'
                  ? maxBuyQuantity
                  : (selectedHolding?.quantity ?? 0)
              }
              aliasCode={selectedStock.alias_code}
              isPending={tradeMutation.isPending}
              onSubmit={handleTradeSubmit}
              onCancel={() => setTradePanel({ open: false, type: 'buy' })}
            />
          </S.TradePanel>
        </S.TradeOverlay>
      )}

      {/* 방 모드: 투자 완료 후 대기 오버레이 */}
      {isRoomMode && showRoomWaiting && (
        <WaitingOverlay
          readyCount={readyCount}
          totalCount={totalCount}
          participants={participants}
        />
      )}
    </S.Container>
  );
};

export default GamePage;

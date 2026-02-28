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
import * as S from './GamePage.styles';
import { START_YEAR } from '../constants/game';
import { useGamePageLogic } from './hooks/useGamePageLogic';

const GamePage = () => {
  const {
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
    tradeMutationIsPending,
    advanceYearMutationIsPending,
    roomReadyMutationIsPending,
    roomNextRoundMutationIsPending,
    setSelectedStockId,
    openTradePanel,
    closeTradePanel,
    handleTradeSubmit,
    handleHintComplete,
    handleTutorialComplete,
    handleInvestComplete,
    handleSettlementNext,
    handleRoomNextRound,
  } = useGamePageLogic();

  if (!isHydrated || !sessionId) {
    return <S.LoadingContainer>게임을 로딩 중입니다...</S.LoadingContainer>;
  }

  if (stocks.length === 0) {
    return (
      <S.LoadingContainer>종목 데이터를 불러오는 중...</S.LoadingContainer>
    );
  }

  if (showTutorial) {
    return <GameTutorial onComplete={handleTutorialComplete} />;
  }

  if (phase === 'hint') {
    return (
      <HintPhase
        sessionId={sessionId}
        year={currentYear}
        stocks={stocks}
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
            isPending={roomNextRoundMutationIsPending}
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
            onClick={() => openTradePanel('buy')}
          >
            매수
          </S.TradeButton>
          <S.TradeButton
            variant="sell"
            disabled={!selectedHolding || selectedHolding.quantity === 0}
            onClick={() => openTradePanel('sell')}
          >
            매도
          </S.TradeButton>
        </S.TradeActions>

        <S.InvestCompleteButton
          onClick={handleInvestComplete}
          disabled={
            isRoomMode
              ? roomReadyMutationIsPending || showRoomWaiting
              : advanceYearMutationIsPending
          }
        >
          {isRoomMode
            ? roomReadyMutationIsPending
              ? '전송 중...'
              : showRoomWaiting
                ? '대기 중...'
                : '투자 완료'
            : advanceYearMutationIsPending
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
        <S.TradeOverlay onClick={closeTradePanel}>
          <S.TradePanel onClick={(e) => e.stopPropagation()}>
            <S.HandleBar />
            <TradeForm
              tradeType={tradePanel.type}
              currentPrice={currentSelectedPrice}
              maxQuantity={
                tradePanel.type === 'buy'
                  ? maxBuyQuantity
                  : (selectedHolding?.quantity ?? 0)
              }
              aliasCode={selectedStock.alias_code}
              isPending={tradeMutationIsPending}
              onSubmit={handleTradeSubmit}
              onCancel={closeTradePanel}
            />
          </S.TradePanel>
        </S.TradeOverlay>
      )}

      {/* 방 모드: 투자 완료 후 대기 오버레이 */}
      {isRoomMode && showRoomWaiting && (
        <WaitingOverlay participants={participants} />
      )}
    </S.Container>
  );
};

export default GamePage;

import { useNavigate } from 'react-router-dom';

import { PATH } from '@/constants';

import * as S from './GameCompletePage.styles';
import CumulativeAssetChart from '../components/CumulativeAssetChart';
import StockRevealAnimation from './components/StockRevealAnimation';
import { useMyRanking } from './hooks/useMyRanking';
import { useRoomFinalRankings } from './hooks/useRoomFinalRankings';
import { useStockReveal } from './hooks/useStockReveal';
import { useGameStore } from '../stores/gameStore';
import { useRoomStore } from '../stores/roomStore';

const GameCompletePage = () => {
  const navigate = useNavigate();
  const {
    sessionId,
    totalAsset,
    settlementHistory,
    reset: resetGame,
  } = useGameStore();
  const { roomId, participantId, nickname } = useRoomStore();
  const resetRoom = useRoomStore((s) => s.reset);

  const isRoomMode = !!roomId;

  // 솔로 모드: 개인 랭킹 조회
  const { data: myRanking, isLoading: isRankingLoading } = useMyRanking(
    sessionId,
    { enabled: !isRoomMode },
  );

  // 방 모드: 방 내 최종 순위 조회
  const { data: roomRankings, isLoading: isRoomRankingLoading } =
    useRoomFinalRankings(roomId, { enabled: isRoomMode });

  // 실제 종목명 공개
  const { data: revealedStocks = [], isLoading: isRevealLoading } =
    useStockReveal(sessionId);

  // 방 모드에서 내 순위 정보 추출
  const myRoomRanking = roomRankings?.find(
    (r) => r.participant_id === participantId,
  );

  const returnRate = isRoomMode
    ? (myRoomRanking?.total_return_rate ?? 0)
    : (myRanking?.total_return_rate ?? 0);
  const isProfit = returnRate >= 0;
  const yearlySummary = isRoomMode ? [] : (myRanking?.yearly_summary ?? []);

  const handleNewGame = () => {
    resetGame();
    if (isRoomMode) resetRoom();
    navigate(PATH.TRADERS);
  };

  const isLoading = isRoomMode
    ? isRoomRankingLoading || isRevealLoading
    : isRankingLoading || isRevealLoading;

  if (isLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.Title>결과를 불러오는 중...</S.Title>
        </S.Header>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>게임 완료!</S.Title>
        <S.Subtitle>
          {isRoomMode
            ? '멀티플레이 투자 대결이 끝났습니다'
            : '16년간의 투자 여정이 끝났습니다'}
        </S.Subtitle>
      </S.Header>

      <S.SummarySection>
        <S.SummaryCard>
          <S.SummaryItem>
            <S.SummaryLabel>최종 자산</S.SummaryLabel>
            <S.SummaryValue>
              {(isRoomMode
                ? (myRoomRanking?.final_asset ?? totalAsset)
                : (myRanking?.final_asset ?? totalAsset)
              ).toLocaleString()}
              원
            </S.SummaryValue>
          </S.SummaryItem>
          <S.SummaryItem>
            <S.SummaryLabel>총 수익률</S.SummaryLabel>
            <S.ReturnRate isProfit={isProfit}>
              {isProfit ? '+' : ''}
              {returnRate.toFixed(1)}%
            </S.ReturnRate>
          </S.SummaryItem>
          <S.SummaryItem>
            <S.SummaryLabel>랭킹</S.SummaryLabel>
            <S.SummaryValue>
              {isRoomMode
                ? (myRoomRanking?.rank_position ?? '-')
                : (myRanking?.rank_position ?? '-')}
              위
            </S.SummaryValue>
          </S.SummaryItem>
        </S.SummaryCard>
      </S.SummarySection>

      <S.Content>
        {/* 방 모드: 전체 참가자 최종 순위 */}
        {isRoomMode && roomRankings && roomRankings.length > 0 && (
          <S.YearlySummarySection>
            <S.SectionTitle>최종 순위</S.SectionTitle>
            <S.YearlySummaryTable>
              <S.YearlySummaryHeader>
                <S.YearlyHeaderCell>순위</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>닉네임</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>최종 자산</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>수익률</S.YearlyHeaderCell>
              </S.YearlySummaryHeader>
              {roomRankings.map((entry) => {
                const entryProfit = entry.total_return_rate >= 0;
                const isMe =
                  entry.participant_id === participantId ||
                  entry.nickname === nickname;
                return (
                  <S.YearlySummaryRow
                    key={entry.participant_id}
                    style={
                      isMe
                        ? { backgroundColor: 'rgba(59, 130, 246, 0.08)' }
                        : undefined
                    }
                  >
                    <S.YearlyCell>{entry.rank_position}</S.YearlyCell>
                    <S.YearlyCell>{entry.nickname}</S.YearlyCell>
                    <S.YearlyCell>
                      {(entry.final_asset / 10000).toFixed(0)}만
                    </S.YearlyCell>
                    <S.YearlyPnlCell isProfit={entryProfit}>
                      {entryProfit ? '+' : ''}
                      {entry.total_return_rate.toFixed(1)}%
                    </S.YearlyPnlCell>
                  </S.YearlySummaryRow>
                );
              })}
            </S.YearlySummaryTable>
          </S.YearlySummarySection>
        )}

        {settlementHistory.length > 0 && (
          <S.ChartSection>
            <S.SectionTitle>16년 자산 추이</S.SectionTitle>
            <CumulativeAssetChart
              settlements={settlementHistory}
              height={220}
            />
          </S.ChartSection>
        )}

        {!isRoomMode && yearlySummary.length > 0 && (
          <S.YearlySummarySection>
            <S.SectionTitle>연도별 성과</S.SectionTitle>
            <S.YearlySummaryTable>
              <S.YearlySummaryHeader>
                <S.YearlyHeaderCell>연도</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>시작</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>종료</S.YearlyHeaderCell>
                <S.YearlyHeaderCell>수익률</S.YearlyHeaderCell>
              </S.YearlySummaryHeader>
              {yearlySummary.map((ys) => {
                const ysProfit = ys.return_rate >= 0;
                return (
                  <S.YearlySummaryRow key={ys.year}>
                    <S.YearlyCell>{ys.year}</S.YearlyCell>
                    <S.YearlyCell>
                      {(ys.starting_asset / 10000).toFixed(0)}만
                    </S.YearlyCell>
                    <S.YearlyCell>
                      {(ys.ending_asset / 10000).toFixed(0)}만
                    </S.YearlyCell>
                    <S.YearlyPnlCell isProfit={ysProfit}>
                      {ysProfit ? '+' : ''}
                      {ys.return_rate.toFixed(1)}%
                    </S.YearlyPnlCell>
                  </S.YearlySummaryRow>
                );
              })}
            </S.YearlySummaryTable>
          </S.YearlySummarySection>
        )}

        {revealedStocks.length > 0 && (
          <StockRevealAnimation stocks={revealedStocks} />
        )}
      </S.Content>

      <S.ButtonGroup>
        <S.SecondaryButton onClick={() => navigate(PATH.TRADERS_RANKING)}>
          전체 랭킹 보기
        </S.SecondaryButton>
        <S.PrimaryButton onClick={handleNewGame}>
          {isRoomMode ? '로비로 돌아가기' : '새 게임 시작'}
        </S.PrimaryButton>
      </S.ButtonGroup>
    </S.Container>
  );
};

export default GameCompletePage;

import * as S from './EnhancedSettlement.styles';
import CumulativeAssetChart from '../../../components/CumulativeAssetChart';
import type { EnhancedSettlementResult } from '../../../interfaces/game';
import { useGameStore } from '../../../stores/gameStore';

interface EnhancedSettlementProps {
  settlement: EnhancedSettlementResult;
  isGameCompleted: boolean;
  onNext: () => void;
}

const EnhancedSettlement = ({
  settlement,
  isGameCompleted,
  onNext,
}: EnhancedSettlementProps) => {
  const { settlementHistory } = useGameStore();
  const isProfit = settlement.return_rate >= 0;
  const performances = settlement.stock_performances ?? [];

  return (
    <S.Container>
      <S.Header>
        <S.Year>{settlement.year}년 결산</S.Year>
        <S.Title>연간 수익률</S.Title>
        <S.ReturnRate isProfit={isProfit}>
          {isProfit ? '+' : ''}
          {settlement.return_rate.toFixed(1)}%
        </S.ReturnRate>
      </S.Header>

      <S.SummaryGrid>
        <S.SummaryItem>
          <S.SummaryLabel>시작 자산</S.SummaryLabel>
          <S.SummaryValue>
            {settlement.starting_asset.toLocaleString()}원
          </S.SummaryValue>
        </S.SummaryItem>
        <S.SummaryItem>
          <S.SummaryLabel>종료 자산</S.SummaryLabel>
          <S.SummaryValue>
            {settlement.ending_asset.toLocaleString()}원
          </S.SummaryValue>
        </S.SummaryItem>
        <S.SummaryItem>
          <S.SummaryLabel>총 거래 횟수</S.SummaryLabel>
          <S.SummaryValue>{settlement.total_trades}회</S.SummaryValue>
        </S.SummaryItem>
        <S.SummaryItem>
          <S.SummaryLabel>수익/손실</S.SummaryLabel>
          <S.SummaryValue>
            {(settlement.ending_asset - settlement.starting_asset).toLocaleString()}원
          </S.SummaryValue>
        </S.SummaryItem>
      </S.SummaryGrid>

      {performances.length > 0 && (
        <>
          <S.SectionTitle>종목별 성과</S.SectionTitle>
          <S.PerformanceTable>
            <S.TableHeader>
              <S.TableHeaderCell>종목</S.TableHeaderCell>
              <S.TableHeaderCell>매입가</S.TableHeaderCell>
              <S.TableHeaderCell>연말가</S.TableHeaderCell>
              <S.TableHeaderCell>수익률</S.TableHeaderCell>
            </S.TableHeader>
            {performances.map((perf) => {
              const perfIsProfit = perf.return_rate >= 0;
              return (
                <S.TableRow key={perf.stock_id}>
                  <S.TableCell>{perf.alias_code}</S.TableCell>
                  <S.TableCell>
                    {perf.avg_buy_price > 0
                      ? perf.avg_buy_price.toLocaleString()
                      : '-'}
                  </S.TableCell>
                  <S.TableCell>
                    {perf.year_end_price.toLocaleString()}
                  </S.TableCell>
                  <S.PnlCell isProfit={perfIsProfit}>
                    {perfIsProfit ? '+' : ''}
                    {perf.return_rate.toFixed(1)}%
                  </S.PnlCell>
                </S.TableRow>
              );
            })}
          </S.PerformanceTable>
        </>
      )}

      {performances.length === 0 && (
        <S.EmptyPerformance>
          이번 연도에는 거래 내역이 없습니다
        </S.EmptyPerformance>
      )}

      {settlementHistory.length > 1 && (
        <>
          <S.SectionTitle>누적 자산 추이</S.SectionTitle>
          <CumulativeAssetChart settlements={settlementHistory} />
        </>
      )}

      <S.NextButton onClick={onNext}>
        {isGameCompleted ? '최종 결과 보기' : '다음 해로 이동'}
      </S.NextButton>
    </S.Container>
  );
};

export default EnhancedSettlement;

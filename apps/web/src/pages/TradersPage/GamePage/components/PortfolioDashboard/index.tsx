import * as S from './PortfolioDashboard.styles';
import type { PortfolioItem } from '../../../interfaces/game';

interface PortfolioDashboardProps {
  cashBalance: number;
  totalAsset: number;
  portfolio: PortfolioItem[];
}

const PortfolioDashboard = ({
  cashBalance,
  totalAsset,
  portfolio,
}: PortfolioDashboardProps) => {
  const stockValue = portfolio.reduce(
    (sum, item) => sum + item.current_price * item.quantity,
    0,
  );

  return (
    <S.Container>
      <S.Summary>
        <S.SummaryItem>
          <S.SummaryLabel>보유 현금</S.SummaryLabel>
          <S.SummaryValue>{cashBalance.toLocaleString()}원</S.SummaryValue>
        </S.SummaryItem>
        <S.SummaryItem>
          <S.SummaryLabel>주식 평가액</S.SummaryLabel>
          <S.SummaryValue>{stockValue.toLocaleString()}원</S.SummaryValue>
        </S.SummaryItem>
        <S.SummaryItem>
          <S.SummaryLabel>총 자산</S.SummaryLabel>
          <S.SummaryValue>{totalAsset.toLocaleString()}원</S.SummaryValue>
        </S.SummaryItem>
      </S.Summary>

      <S.Divider />

      <S.HoldingList>
        {portfolio.length === 0 ? (
          <S.EmptyMessage>보유 종목이 없습니다</S.EmptyMessage>
        ) : (
          portfolio.map((item) => (
            <S.HoldingItem key={item.stock_id}>
              <S.HoldingLeft>
                <S.HoldingCode>
                  {item.alias_code} ({item.category})
                </S.HoldingCode>
                <S.HoldingDetail>
                  {item.quantity}주 · 평균 {item.avg_buy_price.toLocaleString()}원
                </S.HoldingDetail>
              </S.HoldingLeft>
              <S.HoldingRight>
                <S.HoldingValue>
                  {(item.current_price * item.quantity).toLocaleString()}원
                </S.HoldingValue>
              </S.HoldingRight>
            </S.HoldingItem>
          ))
        )}
      </S.HoldingList>
    </S.Container>
  );
};

export default PortfolioDashboard;

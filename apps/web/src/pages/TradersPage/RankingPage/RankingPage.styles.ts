import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const BackButton = styled.button`
  padding: 6px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.traders.textPrimary};
  font-size: 18px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.heading4};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const Content = styled.main`
  flex: 1;
  padding: 16px;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RankingItem = styled.div<{ isTop3: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: ${({ theme, isTop3 }) =>
    isTop3 ? `${theme.traders.ctaPrimary}14` : theme.traders.bgSecondary};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isTop3 }) =>
      isTop3 ? theme.traders.ctaPrimaryLight : theme.traders.borderSecondary};
`;

const RankNumber = styled.span<{ isTop3: boolean }>`
  min-width: 28px;
  font-size: ${({ isTop3 }) => (isTop3 ? '18px' : '14px')};
  font-weight: 700;
  color: ${({ theme, isTop3 }) =>
    isTop3 ? theme.traders.ctaPrimary : theme.traders.textSecondary};
  text-align: center;
`;

const RankInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Nickname = styled.span`
  ${({ theme }) => theme.typography.body2Bold};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const RankDetail = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textTertiary};
`;

const RankReturn = styled.span<{ isProfit: boolean }>`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
`;

const LoadMoreTrigger = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.traders.textTertiary};
  ${({ theme }) => theme.typography.body4};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.traders.textTertiary};
  ${({ theme }) => theme.typography.body2};
`;

export {
  Container,
  Header,
  BackButton,
  Title,
  Content,
  RankingList,
  RankingItem,
  RankNumber,
  RankInfo,
  Nickname,
  RankDetail,
  RankReturn,
  LoadMoreTrigger,
  EmptyState,
};

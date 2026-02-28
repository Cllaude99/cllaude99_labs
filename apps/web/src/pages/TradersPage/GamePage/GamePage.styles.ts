import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const YearMonth = styled.span`
  ${({ theme }) => theme.typography.title1};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TotalAsset = styled.span`
  ${({ theme }) => theme.typography.label1Bold};
  color: ${({ theme }) => theme.traders.ctaPrimary};
  font-variant-numeric: tabular-nums;
`;

const ChartSection = styled.section`
  flex-shrink: 0;
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 24px;
  overflow-y: auto;
`;

const TradeActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TradeButton = styled.button<{ variant: 'buy' | 'sell' }>`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  min-height: 48px;
  border: none;
  background-color: ${({ theme, variant }) =>
    variant === 'buy' ? theme.traders.buy : theme.traders.sell};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const InvestCompleteButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.title2};
  cursor: pointer;
  transition: opacity 0.2s;
  position: sticky;
  bottom: 0;
  min-height: 48px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const TradeOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.traders.surfaceOverlay};
  display: flex;
  align-items: flex-end;
  z-index: 100;
`;

const TradePanel = styled.div`
  width: 100%;
  max-height: 80vh;
  padding: 12px 20px 20px;
  background-color: ${({ theme }) => theme.traders.surfaceElevated};
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
`;

const HandleBar = styled.div`
  width: 36px;
  height: 4px;
  background-color: ${({ theme }) => theme.traders.borderPrimary};
  border-radius: 2px;
  margin: 0 auto 12px;
`;

const PhaseLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${({ theme }) => `${theme.traders.ctaPrimary}1A`};
  border-radius: 8px;
  ${({ theme }) => theme.typography.label2Bold};
  color: ${({ theme }) => theme.traders.ctaPrimary};
`;

const EmptyChartMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  color: ${({ theme }) => theme.traders.textTertiary};
  ${({ theme }) => theme.typography.body3};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
  color: ${({ theme }) => theme.traders.textPrimary};
  ${({ theme }) => theme.typography.body1};
`;

export {
  Container,
  TopBar,
  TopBarRight,
  YearMonth,
  TotalAsset,
  ChartSection,
  BottomSection,
  TradeActions,
  TradeButton,
  InvestCompleteButton,
  TradeOverlay,
  TradePanel,
  HandleBar,
  PhaseLabel,
  EmptyChartMessage,
  LoadingContainer,
};

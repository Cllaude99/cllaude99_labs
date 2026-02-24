import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.palette.white};
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const YearMonth = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TotalAsset = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue500};
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
  border: none;
  background-color: ${({ theme, variant }) =>
    variant === 'buy' ? theme.palette.blue500 : theme.palette.red500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 15px;
  font-weight: 600;
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
  background-color: ${({ theme }) => theme.palette.grey900};
  color: ${({ theme }) => theme.palette.white};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;

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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 100;
`;

const TradePanel = styled.div`
  width: 100%;
  max-height: 80vh;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.white};
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
`;

const PhaseLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${({ theme }) => `${theme.palette.blue500}1A`};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue500};
`;

const EmptyChartMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  background-color: ${({ theme }) => theme.palette.grey50};
  color: ${({ theme }) => theme.palette.grey400};
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.white};
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 16px;
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
  PhaseLabel,
  EmptyChartMessage,
  LoadingContainer,
};

import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
`;

const SummaryLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const SummaryValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.palette.grey150};
`;

const HoldingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HoldingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.palette.grey100};
  border-radius: 8px;
`;

const HoldingLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HoldingCode = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

const HoldingDetail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const HoldingRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const HoldingValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const HoldingPnL = styled.span<{ isProfit: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.palette.blue500 : theme.palette.red500};
  font-variant-numeric: tabular-nums;
`;

const EmptyMessage = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey300};
  text-align: center;
  padding: 16px 0;
`;

export {
  Container,
  Summary,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  Divider,
  HoldingList,
  HoldingItem,
  HoldingLeft,
  HoldingCode,
  HoldingDetail,
  HoldingRight,
  HoldingValue,
  HoldingPnL,
  EmptyMessage,
};

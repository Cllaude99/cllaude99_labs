import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
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
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const SummaryValue = styled.span`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.traders.borderSecondary};
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
  background-color: ${({ theme }) => theme.traders.bgTertiary};
  border-radius: 8px;
`;

const HoldingLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HoldingCode = styled.span`
  ${({ theme }) => theme.typography.label1Bold};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const HoldingDetail = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const HoldingRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const HoldingValue = styled.span`
  ${({ theme }) => theme.typography.label1Bold};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const EmptyMessage = styled.p`
  ${({ theme }) => theme.typography.body4};
  color: ${({ theme }) => theme.traders.textTertiary};
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
  EmptyMessage,
};

import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Year = styled.span`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.heading4};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const ReturnRate = styled.span<{ isProfit: boolean }>`
  ${({ theme }) => theme.typography.heading1};
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background-color: ${({ theme }) => theme.traders.bgTertiary};
  border-radius: 8px;
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

const SectionTitle = styled.h3`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.traders.textPrimary};
  margin-top: 4px;
`;

const PerformanceTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.traders.surfaceCard};
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const TableHeaderCell = styled.span`
  ${({ theme }) => theme.typography.caption2};
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: right;

  &:first-of-type {
    text-align: left;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.traders.bgTertiary};

  &:last-of-type {
    border-bottom: none;
  }
`;

const TableCell = styled.span`
  ${({ theme }) => theme.typography.body4};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:first-of-type {
    text-align: left;
    font-weight: 600;
  }
`;

const PnlCell = styled.span<{ isProfit: boolean }>`
  ${({ theme }) => theme.typography.label2Bold};
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const NextButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.title2};
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyPerformance = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.traders.textSecondary};
  ${({ theme }) => theme.typography.body3};
`;

export {
  Container,
  Header,
  Year,
  Title,
  ReturnRate,
  SummaryGrid,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  SectionTitle,
  PerformanceTable,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  PnlCell,
  NextButton,
  EmptyPerformance,
};

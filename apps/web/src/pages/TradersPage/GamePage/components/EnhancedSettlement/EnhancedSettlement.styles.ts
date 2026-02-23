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
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

const ReturnRate = styled.span<{ isProfit: boolean }>`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme, isProfit }) => (isProfit ? theme.palette.blue500 : theme.palette.red500)};
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
  background-color: ${({ theme }) => theme.palette.grey100};
  border-radius: 8px;
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

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  margin-top: 4px;
`;

const PerformanceTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.palette.white};
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const TableHeaderCell = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey500};
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
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey100};

  &:last-of-type {
    border-bottom: none;
  }
`;

const TableCell = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:first-of-type {
    text-align: left;
    font-weight: 600;
  }
`;

const PnlCell = styled.span<{ isProfit: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, isProfit }) => (isProfit ? theme.palette.blue500 : theme.palette.red500)};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const NextButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyPerformance = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.palette.grey500};
  font-size: 14px;
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

import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

const Header = styled.header`
  padding: 20px 16px;
  text-align: center;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.heading1};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const Subtitle = styled.p`
  ${({ theme }) => theme.typography.body3};
  color: ${({ theme }) => theme.traders.textSecondary};
  margin-top: 4px;
`;

const SummarySection = styled.section`
  padding: 0 16px;
`;

const SummaryCard = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const SummaryLabel = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const SummaryValue = styled.span`
  ${({ theme }) => theme.typography.title1};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const ReturnRate = styled.span<{ isProfit: boolean }>`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
`;

const Content = styled.main`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`;

const ChartSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const YearlySummarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const YearlySummaryTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  border-radius: 8px;
  overflow: hidden;
`;

const YearlySummaryHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.traders.surfaceCard};
  border-bottom: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const YearlyHeaderCell = styled.span`
  ${({ theme }) => theme.typography.caption2};
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: right;

  &:first-of-type {
    text-align: left;
  }
`;

const YearlySummaryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1fr;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.traders.bgSecondary};

  &:last-of-type {
    border-bottom: none;
  }
`;

const YearlyCell = styled.span`
  ${({ theme }) => theme.typography.body4};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:first-of-type {
    text-align: left;
    font-weight: 600;
  }
`;

const YearlyPnlCell = styled.span<{ isProfit: boolean }>`
  ${({ theme }) => theme.typography.label2Bold};
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.traders.profitPositive : theme.traders.profitNegative};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
`;

const PrimaryButton = styled.button`
  flex: 2;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.title2};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background-color: transparent;
  color: ${({ theme }) => theme.traders.textSecondary};
  ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.traders.bgSecondary};
  }
`;

export {
  Container,
  Header,
  Title,
  Subtitle,
  SummarySection,
  SummaryCard,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  ReturnRate,
  Content,
  ChartSection,
  SectionTitle,
  YearlySummarySection,
  YearlySummaryTable,
  YearlySummaryHeader,
  YearlyHeaderCell,
  YearlySummaryRow,
  YearlyCell,
  YearlyPnlCell,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
};

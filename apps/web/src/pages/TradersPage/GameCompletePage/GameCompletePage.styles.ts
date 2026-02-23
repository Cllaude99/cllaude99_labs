import styled from '@emotion/styled';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.white};
`;

const Header = styled.header`
  padding: 20px 16px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.grey900};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
  margin-top: 4px;
`;

const SummarySection = styled.section`
  padding: 0 16px;
`;

const SummaryCard = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const SummaryLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const SummaryValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const ReturnRate = styled.span<{ isProfit: boolean }>`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.palette.blue500 : theme.palette.red500};
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
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

const YearlySummarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const YearlySummaryTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  border-radius: 8px;
  overflow: hidden;
`;

const YearlySummaryHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1fr;
  gap: 4px;
  padding: 10px 12px;
  background-color: ${({ theme }) => theme.palette.white};
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const YearlyHeaderCell = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey500};
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
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey50};

  &:last-of-type {
    border-bottom: none;
  }
`;

const YearlyCell = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:first-of-type {
    text-align: left;
    font-weight: 600;
  }
`;

const YearlyPnlCell = styled.span<{ isProfit: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, isProfit }) =>
    isProfit ? theme.palette.blue500 : theme.palette.red500};
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
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  background-color: transparent;
  color: ${({ theme }) => theme.palette.grey600};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey50};
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

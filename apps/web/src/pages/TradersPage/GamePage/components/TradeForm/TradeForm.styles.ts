import styled from '@emotion/styled';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StockCode = styled.span`
  ${({ theme }) => theme.typography.heading4};
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const TradeTypeLabel = styled.span<{ isBuy: boolean }>`
  ${({ theme }) => theme.typography.label1Bold};
  padding: 4px 12px;
  border-radius: 6px;
  color: ${({ theme, isBuy }) =>
    isBuy ? theme.traders.buy : theme.traders.sell};
  background-color: ${({ theme, isBuy }) =>
    isBuy ? `${theme.traders.buy}26` : `${theme.traders.sell}26`};
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body4};
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const Value = styled.span`
  ${({ theme }) => theme.typography.title2};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const QuantityInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background-color: ${({ theme }) => theme.traders.bgTertiary};
  overflow: hidden;

  &:focus-within {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const StepperButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.traders.textSecondary};
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.traders.borderSecondary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.traders.textPrimary};
  ${({ theme }) => theme.typography.body1};
  font-variant-numeric: tabular-nums;
  outline: none;
  text-align: center;

  &::placeholder {
    color: ${({ theme }) => theme.traders.textTertiary};
  }
`;

const MaxButton = styled.button`
  align-self: flex-end;
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.textLink};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;

  &:hover {
    text-decoration: underline;
  }
`;

const QuickButtonRow = styled.div`
  display: flex;
  gap: 6px;
`;

const QuickButton = styled.button`
  flex: 1;
  padding: 6px 0;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.traders.borderPrimary};
  background-color: ${({ theme }) => theme.traders.surfaceCard};
  color: ${({ theme }) => theme.traders.textSecondary};
  ${({ theme }) => theme.typography.caption1};
  cursor: pointer;
  min-height: 32px;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
    color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const ErrorText = styled.span`
  ${({ theme }) => theme.typography.caption1};
  color: ${({ theme }) => theme.traders.statusError};
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const TotalValue = styled.span`
  ${({ theme }) => theme.typography.title1};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
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

const SubmitButton = styled.button<{ isBuy: boolean }>`
  flex: 2;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme, isBuy }) =>
    isBuy ? theme.traders.buy : theme.traders.sell};
  color: ${({ theme }) => theme.traders.textInverse};
  ${({ theme }) => theme.typography.body2Bold};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export {
  FormContainer,
  Header,
  StockCode,
  TradeTypeLabel,
  PriceInfo,
  Label,
  Value,
  InputGroup,
  QuantityInputWrapper,
  StepperButton,
  QuantityInput,
  QuickButtonRow,
  QuickButton,
  MaxButton,
  ErrorText,
  TotalAmount,
  TotalValue,
  ButtonGroup,
  CancelButton,
  SubmitButton,
};

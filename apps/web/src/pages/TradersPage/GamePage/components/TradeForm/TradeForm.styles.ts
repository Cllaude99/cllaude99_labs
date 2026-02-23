import styled from '@emotion/styled';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StockCode = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
`;

const TradeTypeLabel = styled.span<{ isBuy: boolean }>`
  font-size: 14px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  color: ${({ theme, isBuy }) =>
    isBuy ? theme.palette.blue500 : theme.palette.red500};
  background-color: ${({ theme, isBuy }) =>
    isBuy ? `${theme.palette.blue500}26` : `${theme.palette.red500}26`};
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey500};
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const QuantityInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  background-color: ${({ theme }) => theme.palette.grey100};
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.palette.blue500};
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette.grey300};
  }
`;

const MaxButton = styled.button`
  align-self: flex-end;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.blue500};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.red500};
`;

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
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

const SubmitButton = styled.button<{ isBuy: boolean }>`
  flex: 2;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme, isBuy }) =>
    isBuy ? theme.palette.blue500 : theme.palette.red500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 15px;
  font-weight: 600;
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
  QuantityInput,
  MaxButton,
  ErrorText,
  TotalAmount,
  TotalValue,
  ButtonGroup,
  CancelButton,
  SubmitButton,
};

import { useForm } from 'react-hook-form';

import * as S from './TradeForm.styles';
import type { TradeType } from '../../../interfaces/trade';

interface TradeFormData {
  quantity: number;
}

interface TradeFormProps {
  tradeType: TradeType;
  currentPrice: number;
  maxQuantity: number;
  aliasCode: string;
  isPending: boolean;
  onSubmit: (quantity: number) => void;
  onCancel: () => void;
}

const QUICK_RATIOS = [
  { label: '10%', value: 0.1 },
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '최대', value: 1 },
] as const;

const TradeForm = ({
  tradeType,
  currentPrice,
  maxQuantity,
  aliasCode,
  isPending,
  onSubmit,
  onCancel,
}: TradeFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TradeFormData>();

  const quantity = watch('quantity', 0);
  const totalAmount = (quantity || 0) * currentPrice;
  const isBuy = tradeType === 'buy';

  const handleQuickRatio = (ratio: number) => {
    const qty = Math.floor(maxQuantity * ratio);
    if (qty > 0) {
      setValue('quantity', qty);
    }
  };

  const handleStep = (delta: number) => {
    const current = quantity || 0;
    const next = Math.max(0, Math.min(maxQuantity, current + delta));
    setValue('quantity', next);
  };

  return (
    <S.FormContainer onSubmit={handleSubmit((data) => onSubmit(data.quantity))}>
      <S.Header>
        <S.StockCode>{aliasCode}</S.StockCode>
        <S.TradeTypeLabel isBuy={isBuy}>
          {isBuy ? '매수' : '매도'}
        </S.TradeTypeLabel>
      </S.Header>

      <S.PriceInfo>
        <S.Label>현재가</S.Label>
        <S.Value>{currentPrice.toLocaleString()}원</S.Value>
      </S.PriceInfo>

      <S.InputGroup>
        <S.Label>수량</S.Label>
        <S.QuantityInputWrapper>
          <S.StepperButton
            type="button"
            onClick={() => handleStep(-1)}
            disabled={!quantity || quantity <= 0}
          >
            −
          </S.StepperButton>
          <S.QuantityInput
            type="number"
            {...register('quantity', {
              required: '수량을 입력하세요',
              min: { value: 1, message: '1주 이상 입력하세요' },
              max: {
                value: maxQuantity,
                message: `최대 ${maxQuantity.toLocaleString()}주까지 가능합니다`,
              },
              valueAsNumber: true,
            })}
            placeholder="수량 입력"
          />
          <S.StepperButton
            type="button"
            onClick={() => handleStep(1)}
            disabled={quantity >= maxQuantity}
          >
            +
          </S.StepperButton>
        </S.QuantityInputWrapper>
        {errors.quantity && (
          <S.ErrorText>{errors.quantity.message}</S.ErrorText>
        )}
        <S.QuickButtonRow>
          {QUICK_RATIOS.map(({ label, value }) => (
            <S.QuickButton
              key={label}
              type="button"
              onClick={() => handleQuickRatio(value)}
            >
              {label}
            </S.QuickButton>
          ))}
        </S.QuickButtonRow>
        <S.MaxButton
          type="button"
          onClick={() => setValue('quantity', maxQuantity)}
        >
          최대 {maxQuantity.toLocaleString()}주
        </S.MaxButton>
      </S.InputGroup>

      <S.TotalAmount>
        <S.Label>예상 {isBuy ? '매수' : '매도'} 금액</S.Label>
        <S.TotalValue>{totalAmount.toLocaleString()}원</S.TotalValue>
      </S.TotalAmount>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={onCancel}>
          취소
        </S.CancelButton>
        <S.SubmitButton type="submit" isBuy={isBuy} disabled={isPending}>
          {isPending ? '처리 중...' : isBuy ? '매수' : '매도'}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.FormContainer>
  );
};

export default TradeForm;

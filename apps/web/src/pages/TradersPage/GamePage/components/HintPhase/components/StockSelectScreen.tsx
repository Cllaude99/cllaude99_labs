import type { StockInfo } from '../../../../interfaces/game';
import * as S from '../HintPhase.styles';

interface StockSelectScreenProps {
  stocks: StockInfo[];
  onSelect: (stockId: string) => void;
  onSkip: () => void;
}

const StockSelectScreen = ({
  stocks,
  onSelect,
  onSkip,
}: StockSelectScreenProps) => {
  return (
    <>
      <S.StockGrid>
        {stocks.map((stock) => (
          <S.StockCard
            key={stock.stock_id}
            onClick={() => onSelect(stock.stock_id)}
          >
            <S.StockCardCode>{stock.alias_code}</S.StockCardCode>
            <S.StockCardCategory>{stock.category}</S.StockCardCategory>
          </S.StockCard>
        ))}
      </S.StockGrid>
      <S.SkipButton onClick={onSkip}>힌트 없이 진행하기</S.SkipButton>
    </>
  );
};

export default StockSelectScreen;

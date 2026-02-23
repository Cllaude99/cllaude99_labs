import * as S from './StockList.styles';
import type { StockInfo } from '../../../interfaces/game';


interface StockListProps {
  stocks: StockInfo[];
  selectedStockId: string | null;
  onSelect: (stockId: string) => void;
  currentPrices?: Record<string, number>;
  prevYearEndPrices?: Record<string, number>;
  isLoading?: boolean;
}

const StockList = ({
  stocks,
  selectedStockId,
  onSelect,
  currentPrices = {},
  prevYearEndPrices = {},
  isLoading = false,
}: StockListProps) => {
  if (isLoading) {
    return (
      <S.Container>
        <S.TabList>
          {stocks.map((stock) => (
            <S.SkeletonTab key={stock.stock_id}>
              <S.SkeletonText width="20px" />
              <S.SkeletonText width="30px" />
              <S.SkeletonText width="50px" />
            </S.SkeletonTab>
          ))}
        </S.TabList>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.TabList role="tablist">
        {stocks.map((stock) => {
          const price = currentPrices[stock.stock_id];
          const isListed = price !== undefined && price > 0;
          const prevPrice = prevYearEndPrices[stock.stock_id];
          const changeRate =
            isListed && prevPrice !== undefined && prevPrice > 0
              ? ((price - prevPrice) / prevPrice) * 100
              : undefined;

          return (
            <S.Tab
              key={stock.stock_id}
              role="tab"
              active={selectedStockId === stock.stock_id}
              disabled={!isListed}
              onClick={() => isListed && onSelect(stock.stock_id)}
              aria-selected={selectedStockId === stock.stock_id}
              aria-disabled={!isListed}
            >
              <S.AliasCode disabled={!isListed}>{stock.alias_code}</S.AliasCode>
              <S.Category>{stock.category}</S.Category>
              {isListed ? (
                <S.Price>{price.toLocaleString()}</S.Price>
              ) : (
                <S.UnlistedLabel>상장 전</S.UnlistedLabel>
              )}
              {changeRate !== undefined && (
                <S.ChangeRate isPositive={changeRate >= 0}>
                  {changeRate >= 0 ? '+' : ''}
                  {changeRate.toFixed(1)}%
                </S.ChangeRate>
              )}
            </S.Tab>
          );
        })}
      </S.TabList>
    </S.Container>
  );
};

export default StockList;

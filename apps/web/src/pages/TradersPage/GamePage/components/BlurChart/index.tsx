import { useEffect, useRef, useState } from 'react';

import {
  type IChartApi,
  AreaSeries,
  CrosshairMode,
  createChart,
} from 'lightweight-charts';

import * as S from './BlurChart.styles';
import type { BlurChartData } from '../../../interfaces/stock';


interface BlurChartProps {
  data: BlurChartData | null;
}

const BlurChart = ({ data }: BlurChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedStockIdx, setSelectedStockIdx] = useState(0);

  const isUnlocked = data?.is_unlocked ?? false;
  const stocks = data?.preview_data ?? [];
  const selectedStock = stocks[selectedStockIdx];

  useEffect(() => {
    if (!chartContainerRef.current || !selectedStock) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      handleScroll: false,
      handleScale: false,
      layout: {
        background: { color: 'transparent' },
        textColor: '#888',
      },
      timeScale: { visible: false },
      rightPriceScale: { visible: false },
      crosshair: { mode: CrosshairMode.Hidden },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
    });

    const areaSeries = chartRef.current.addSeries(AreaSeries, {
      lineColor: '#4a90d9',
      topColor: 'rgba(74, 144, 217, 0.4)',
      bottomColor: 'rgba(74, 144, 217, 0.0)',
      lineWidth: 2,
    });

    areaSeries.setData(
      selectedStock.daily_closes.map((d) => ({ time: d.date, value: d.close })),
    );

    chartRef.current.timeScale().fitContent();

    return () => {
      chartRef.current?.remove();
    };
  }, [selectedStock]);

  if (!data || stocks.length === 0) return null;

  return (
    <>
      <S.YearLabel>
        {data.year}년 블러 차트 미리보기
        {data.description && ` - ${data.description}`}
      </S.YearLabel>
      {stocks.length > 1 && (
        <S.StockTabs>
          {stocks.map((stock, idx) => (
            <S.StockTab
              key={stock.stock_id}
              active={idx === selectedStockIdx}
              onClick={() => setSelectedStockIdx(idx)}
            >
              {stock.alias_code}
            </S.StockTab>
          ))}
        </S.StockTabs>
      )}
      <S.BlurChartWrapper isUnlocked={isUnlocked}>
        <div ref={chartContainerRef} />
        {!isUnlocked && (
          <S.BlurOverlay>
            <S.LockIcon>🔒</S.LockIcon>
            <S.LockText>블러 차트</S.LockText>
            <S.LockDesc>힌트를 해금하면 차트가 공개됩니다</S.LockDesc>
          </S.BlurOverlay>
        )}
      </S.BlurChartWrapper>
    </>
  );
};

export default BlurChart;

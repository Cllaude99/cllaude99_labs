import { useEffect, useRef } from 'react';

import {
  type IChartApi,
  type ISeriesApi,
  CrosshairMode,
  LineSeries,
  createChart,
} from 'lightweight-charts';

import { palette } from '@cllaude99/ui/design-system/palette';

import * as S from './StockChart.styles';
import type { StockDailyPrice } from '../../../interfaces/stock';


interface StockChartProps {
  prices: StockDailyPrice[];
  height?: number;
}

const StockChart = ({ prices, height = 400 }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: palette.grey50 },
        textColor: palette.grey900,
      },
      grid: {
        vertLines: { color: palette.grey100 },
        horzLines: { color: palette.grey100 },
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: {
        timeVisible: false,
        borderColor: palette.grey100,
      },
      rightPriceScale: {
        borderColor: palette.grey100,
      },
    });

    seriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: palette.blue500,
      lineWidth: 2,
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || prices.length === 0) return;
    seriesRef.current.setData(
      prices.map((p) => ({ time: p.date, value: p.close })),
    );
    chartRef.current?.timeScale().fitContent();
  }, [prices]);

  return (
    <S.ChartContainer>
      <div ref={chartContainerRef} />
    </S.ChartContainer>
  );
};

export default StockChart;

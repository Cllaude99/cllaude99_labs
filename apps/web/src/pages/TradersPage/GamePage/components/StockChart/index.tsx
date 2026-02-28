import { useEffect, useRef } from 'react';

import { useTheme } from '@emotion/react';
import {
  type IChartApi,
  type ISeriesApi,
  AreaSeries,
  CrosshairMode,
  createChart,
} from 'lightweight-charts';

import * as S from './StockChart.styles';
import type { StockDailyPrice } from '../../../interfaces/stock';

interface StockChartProps {
  prices: StockDailyPrice[];
  height?: number;
}

const StockChart = ({ prices, height = 400 }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: theme.traders.chartBg },
        textColor: theme.traders.textPrimary,
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: theme.traders.chartGrid },
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: {
        timeVisible: false,
        borderColor: theme.traders.bgTertiary,
      },
      rightPriceScale: {
        borderColor: theme.traders.bgTertiary,
      },
    });

    seriesRef.current = chartRef.current.addSeries(AreaSeries, {
      lineColor: theme.traders.chartLine,
      topColor: theme.traders.chartArea,
      bottomColor: `${theme.traders.chartLine}05`,
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
  }, [height, theme]);

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

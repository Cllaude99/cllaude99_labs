import { useEffect, useMemo, useRef } from 'react';

import { useTheme } from '@emotion/react';
import {
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  createChart,
} from 'lightweight-charts';

import * as S from './CumulativeAssetChart.styles';
import { INITIAL_CASH } from '../../constants/game';
import type { EnhancedSettlementResult } from '../../interfaces/game';

interface CumulativeAssetChartProps {
  settlements: EnhancedSettlementResult[];
  height?: number;
}

const CumulativeAssetChart = ({
  settlements,
  height = 200,
}: CumulativeAssetChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const assetSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const baselineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: theme.traders.chartBg },
        textColor: theme.traders.textSecondary,
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: theme.traders.bgTertiary },
        horzLines: { color: theme.traders.bgTertiary },
      },
      timeScale: {
        timeVisible: false,
        borderColor: theme.traders.borderSecondary,
      },
      rightPriceScale: {
        borderColor: theme.traders.borderSecondary,
      },
    });

    assetSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: theme.traders.chartLine,
      lineWidth: 2,
    });

    baselineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: theme.traders.textTertiary,
      lineWidth: 1,
      lineStyle: 2,
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

  const { assetData, baselineData } = useMemo(
    () => ({
      assetData: settlements.map((s) => ({
        time: `${s.year}-12-31`,
        value: s.ending_asset,
      })),
      baselineData: settlements.map((s) => ({
        time: `${s.year}-12-31`,
        value: INITIAL_CASH,
      })),
    }),
    [settlements],
  );

  useEffect(() => {
    if (!assetSeriesRef.current || !baselineSeriesRef.current) return;
    if (assetData.length === 0) return;

    assetSeriesRef.current.setData(assetData);
    baselineSeriesRef.current.setData(baselineData);
    chartRef.current?.timeScale().fitContent();
  }, [assetData, baselineData]);

  return (
    <S.ChartContainer>
      <div ref={chartContainerRef} />
    </S.ChartContainer>
  );
};

export default CumulativeAssetChart;

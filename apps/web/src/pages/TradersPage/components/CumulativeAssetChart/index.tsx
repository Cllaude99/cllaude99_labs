import { useEffect, useRef } from 'react';

import {
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  createChart,
} from 'lightweight-charts';

import { palette } from '@cllaude99/ui/design-system/palette';

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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: palette.grey100 },
        textColor: palette.grey500,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: palette.grey100 },
        horzLines: { color: palette.grey100 },
      },
      timeScale: {
        timeVisible: false,
        borderColor: palette.grey150,
      },
      rightPriceScale: {
        borderColor: palette.grey150,
      },
    });

    assetSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: palette.blue500,
      lineWidth: 2,
    });

    baselineSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: palette.grey300,
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
  }, [height]);

  useEffect(() => {
    if (!assetSeriesRef.current || !baselineSeriesRef.current) return;
    if (settlements.length === 0) return;

    const assetData = settlements.map((s) => ({
      time: `${s.year}-12-31`,
      value: s.ending_asset,
    }));

    const baselineData = settlements.map((s) => ({
      time: `${s.year}-12-31`,
      value: INITIAL_CASH,
    }));

    assetSeriesRef.current.setData(assetData);
    baselineSeriesRef.current.setData(baselineData);
    chartRef.current?.timeScale().fitContent();
  }, [settlements]);

  return (
    <S.ChartContainer>
      <div ref={chartContainerRef} />
    </S.ChartContainer>
  );
};

export default CumulativeAssetChart;

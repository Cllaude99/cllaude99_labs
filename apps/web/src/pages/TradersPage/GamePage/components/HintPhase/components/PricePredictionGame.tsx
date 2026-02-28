import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTheme } from '@emotion/react';
import {
  type IChartApi,
  AreaSeries,
  CrosshairMode,
  createChart,
} from 'lightweight-charts';

import * as S from '../HintPhase.styles';

const TOTAL_ROUNDS = 5;

interface PricePoint {
  date: string;
  close: number;
}

interface PricePredictionGameProps {
  onComplete: (maxConsecutive: number) => void;
}

const generateMockPrices = (): PricePoint[][] => {
  const rounds: PricePoint[][] = [];

  for (let r = 0; r < TOTAL_ROUNDS; r++) {
    const baseYear = 2015 + r;
    const points: PricePoint[] = [];
    let price = 10000 + Math.random() * 50000;

    for (let m = 1; m <= 4; m++) {
      const daysInMonth = [31, 28, 31, 30][m - 1];
      for (let d = 1; d <= daysInMonth; d += 3) {
        const change = (Math.random() - 0.48) * price * 0.03;
        price = Math.max(1000, price + change);
        points.push({
          date: `${baseYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          close: Math.round(price),
        });
      }
    }

    rounds.push(points);
  }

  return rounds;
};

const PricePredictionGame = ({ onComplete }: PricePredictionGameProps) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const allRounds = useMemo(() => generateMockPrices(), []);

  const [round, setRound] = useState(0);
  const [consecutive, setConsecutive] = useState(0);
  const [maxConsecutive, setMaxConsecutive] = useState(0);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [waiting, setWaiting] = useState(false);

  const currentPrices = allRounds[round];
  const visiblePrices = useMemo(() => {
    if (!currentPrices) return [];
    return currentPrices.filter((p) => {
      const month = parseInt(p.date.split('-')[1]);
      return month <= 3;
    });
  }, [currentPrices]);

  const actualDirection = useMemo(() => {
    if (!currentPrices) return 'up';
    const threeMonthEnd = visiblePrices[visiblePrices.length - 1]?.close ?? 0;
    const fourthMonthPrices = currentPrices.filter((p) => {
      const month = parseInt(p.date.split('-')[1]);
      return month === 4;
    });
    const fourthMonthEnd =
      fourthMonthPrices[fourthMonthPrices.length - 1]?.close ?? threeMonthEnd;
    return fourthMonthEnd >= threeMonthEnd ? 'up' : 'down';
  }, [currentPrices, visiblePrices]);

  useEffect(() => {
    if (!chartContainerRef.current || visiblePrices.length === 0) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 180,
      handleScroll: false,
      handleScale: false,
      layout: {
        background: { color: 'transparent' },
        textColor: theme.traders.textTertiary,
        attributionLogo: false,
      },
      timeScale: { borderColor: theme.traders.bgTertiary },
      rightPriceScale: { borderColor: theme.traders.bgTertiary },
      crosshair: { mode: CrosshairMode.Normal },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: theme.traders.chartGrid },
      },
    });

    const series = chartRef.current.addSeries(AreaSeries, {
      lineColor: theme.traders.chartLine,
      topColor: `${theme.traders.chartLine}66`,
      bottomColor: `${theme.traders.chartLine}05`,
      lineWidth: 2,
    });

    series.setData(
      visiblePrices.map((p) => ({ time: p.date, value: p.close })),
    );
    chartRef.current.timeScale().fitContent();

    return () => {
      chartRef.current?.remove();
    };
  }, [visiblePrices, theme]);

  const handlePredict = useCallback(
    (direction: 'up' | 'down') => {
      if (waiting) return;
      setWaiting(true);

      const isCorrect = direction === actualDirection;

      if (isCorrect) {
        const newConsecutive = consecutive + 1;
        setConsecutive(newConsecutive);
        setMaxConsecutive((prev) => Math.max(prev, newConsecutive));
        setFeedback({ isCorrect: true, message: '정답!' });
      } else {
        setConsecutive(0);
        setFeedback({ isCorrect: false, message: '오답...' });
      }

      setTimeout(() => {
        setFeedback(null);
        setWaiting(false);

        if (round < TOTAL_ROUNDS - 1) {
          setRound((r) => r + 1);
        } else {
          const finalMax = isCorrect
            ? Math.max(maxConsecutive, consecutive + 1)
            : maxConsecutive;
          onComplete(finalMax);
        }
      }, 1200);
    },
    [
      waiting,
      actualDirection,
      consecutive,
      round,
      maxConsecutive,
      onComplete,
    ],
  );

  return (
    <S.MiniGameContainer>
      <S.RoundLabel>
        라운드 {round + 1} / {TOTAL_ROUNDS}
      </S.RoundLabel>
      <S.ScoreDisplay>연속 정답: {consecutive}회</S.ScoreDisplay>

      <S.MiniChartWrapper>
        <div ref={chartContainerRef} />
      </S.MiniChartWrapper>

      <S.Subtitle>다음 달 주가는 상승할까요, 하락할까요?</S.Subtitle>

      {feedback ? (
        <S.ResultFeedback isCorrect={feedback.isCorrect}>
          {feedback.message}
        </S.ResultFeedback>
      ) : (
        <S.PredictionButtons>
          <S.PredictButton
            variant="up"
            onClick={() => handlePredict('up')}
            disabled={waiting}
          >
            상승
          </S.PredictButton>
          <S.PredictButton
            variant="down"
            onClick={() => handlePredict('down')}
            disabled={waiting}
          >
            하락
          </S.PredictButton>
        </S.PredictionButtons>
      )}
    </S.MiniGameContainer>
  );
};

export default PricePredictionGame;

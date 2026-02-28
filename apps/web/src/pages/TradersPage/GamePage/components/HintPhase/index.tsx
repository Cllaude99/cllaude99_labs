import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { useFunnel } from '@/hooks/useFunnel';

import AdWatchScreen from './components/AdWatchScreen';
import CardMatchGame from './components/CardMatchGame';
import ChoiceScreen from './components/ChoiceScreen';
import HintDisplayScreen from './components/HintDisplayScreen';
import MiniGameSelectScreen from './components/MiniGameSelectScreen';
import MinigameResultScreen from './components/MinigameResultScreen';
import PricePredictionGame from './components/PricePredictionGame';
import QuizResultScreen from './components/QuizResultScreen';
import QuizScreen from './components/QuizScreen';
import StockSelectScreen from './components/StockSelectScreen';
import * as S from './HintPhase.styles';
import type { StockInfo } from '../../../interfaces/game';
import type { QuizAnswerResponse } from '../../apis/hint';
import { submitMinigameResult, unlockHintByAd } from '../../apis/hint';

type HintStep =
  | 'stockSelect'
  | 'choice'
  | 'quiz'
  | 'ad'
  | 'result'
  | 'miniGameSelect'
  | 'miniGame'
  | 'miniGameResult'
  | 'hint';

type GameType = 'price_prediction' | 'card_match';

interface HintPhaseProps {
  sessionId: string;
  year: number;
  stocks: StockInfo[];
  onComplete: () => void;
}

const HintPhase = ({ sessionId, year, stocks, onComplete }: HintPhaseProps) => {
  const { step, setStep } = useFunnel<HintStep>('stockSelect');
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizAnswerResponse | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [minigameScore, setMinigameScore] = useState(0);
  const [minigameHintLevel, setMinigameHintLevel] = useState(0);

  const adUnlockMutation = useMutation({
    mutationFn: () =>
      unlockHintByAd(sessionId, year, selectedStockId ?? undefined),
    onSuccess: () => setStep('hint'),
  });

  const minigameResultMutation = useMutation({
    mutationFn: ({
      gameType,
      score,
    }: {
      gameType: GameType;
      score: number;
    }) =>
      submitMinigameResult(
        sessionId,
        selectedStockId ?? '',
        year,
        gameType,
        score,
      ),
    onSuccess: (data) => {
      setMinigameScore(data.score);
      setMinigameHintLevel(data.hint_level);
      setStep('miniGameResult');
    },
  });

  const handleStockSelect = (stockId: string) => {
    setSelectedStockId(stockId);
    setStep('choice');
  };

  const handleGameSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    setStep('miniGame');
  };

  const selectedStock = stocks.find((s) => s.stock_id === selectedStockId);

  return (
    <S.Container>
      <S.Title>{year}년 - 힌트 시간</S.Title>

      {step === 'stockSelect' && (
        <>
          <S.Subtitle>힌트를 확인할 종목을 선택하세요</S.Subtitle>
          <StockSelectScreen
            stocks={stocks}
            onSelect={handleStockSelect}
            onSkip={onComplete}
          />
        </>
      )}

      {step === 'choice' && (
        <>
          <S.Subtitle>
            {selectedStock?.alias_code} 종목의 힌트를 얻는 방법을 선택하세요
          </S.Subtitle>
          <ChoiceScreen
            onSelectQuiz={() => setStep('quiz')}
            onSelectAd={() => setStep('ad')}
            onSelectMiniGame={() => setStep('miniGameSelect')}
            onSkip={onComplete}
          />
        </>
      )}

      {step === 'quiz' && selectedStockId && (
        <QuizScreen
          year={year}
          sessionId={sessionId}
          stockId={selectedStockId}
          onComplete={(result) => {
            setQuizResult(result);
            setStep('result');
          }}
        />
      )}

      {step === 'ad' && (
        <AdWatchScreen onComplete={() => adUnlockMutation.mutate()} />
      )}

      {step === 'result' && quizResult && (
        <QuizResultScreen
          result={quizResult}
          onContinue={() => setStep('hint')}
        />
      )}

      {step === 'miniGameSelect' && (
        <MiniGameSelectScreen onSelect={handleGameSelect} />
      )}

      {step === 'miniGame' && selectedGameType === 'price_prediction' && (
        <PricePredictionGame
          onComplete={(score) =>
            minigameResultMutation.mutate({
              gameType: 'price_prediction',
              score,
            })
          }
        />
      )}

      {step === 'miniGame' && selectedGameType === 'card_match' && (
        <CardMatchGame
          category={selectedStock?.category ?? ''}
          onComplete={(score) =>
            minigameResultMutation.mutate({ gameType: 'card_match', score })
          }
        />
      )}

      {step === 'miniGameResult' && selectedGameType && (
        <MinigameResultScreen
          gameType={selectedGameType}
          score={minigameScore}
          hintLevel={minigameHintLevel}
          onContinue={() =>
            minigameHintLevel > 0 ? setStep('hint') : onComplete()
          }
        />
      )}

      {step === 'hint' && (
        <HintDisplayScreen
          sessionId={sessionId}
          year={year}
          stockId={selectedStockId ?? undefined}
          onContinue={onComplete}
        />
      )}
    </S.Container>
  );
};

export default HintPhase;

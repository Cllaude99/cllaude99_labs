import { useState } from 'react';

import { useFunnel } from '@/hooks/useFunnel';

import AdWatchScreen from './components/AdWatchScreen';
import ChoiceScreen from './components/ChoiceScreen';
import HintDisplayScreen from './components/HintDisplayScreen';
import QuizResultScreen from './components/QuizResultScreen';
import QuizScreen from './components/QuizScreen';
import * as S from './HintPhase.styles';
import type { QuizAnswerResponse } from '../../apis/hint';

type HintStep = 'choice' | 'quiz' | 'ad' | 'result' | 'hint';

interface HintPhaseProps {
  sessionId: string;
  year: number;
  onComplete: () => void;
}

const HintPhase = ({ sessionId, year, onComplete }: HintPhaseProps) => {
  const { step, setStep } = useFunnel<HintStep>('choice');
  const [quizResult, setQuizResult] = useState<QuizAnswerResponse | null>(null);

  return (
    <S.Container>
      <S.Title>{year}년 - 힌트 시간</S.Title>
      <S.Subtitle>퀴즈를 풀거나 광고를 보고 투자 힌트를 얻으세요</S.Subtitle>

      {step === 'choice' && (
        <ChoiceScreen
          onSelectQuiz={() => setStep('quiz')}
          onSelectAd={() => setStep('ad')}
          onSkip={onComplete}
        />
      )}
      {step === 'quiz' && (
        <QuizScreen
          year={year}
          sessionId={sessionId}
          onComplete={(result) => {
            setQuizResult(result);
            setStep('result');
          }}
        />
      )}
      {step === 'ad' && (
        <AdWatchScreen
          sessionId={sessionId}
          year={year}
          onComplete={() => setStep('hint')}
        />
      )}
      {step === 'result' && quizResult && (
        <QuizResultScreen
          result={quizResult}
          onContinue={() => setStep('hint')}
        />
      )}
      {step === 'hint' && (
        <HintDisplayScreen
          sessionId={sessionId}
          year={year}
          onContinue={onComplete}
        />
      )}
    </S.Container>
  );
};

export default HintPhase;

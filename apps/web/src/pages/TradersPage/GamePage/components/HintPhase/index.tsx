import { useCallback, useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { useFunnel } from '@/hooks/useFunnel';

import * as S from './HintPhase.styles';
import type { HintEntry, QuizAnswerResponse } from '../../apis/hint';
import { submitQuizAnswers, unlockHintByAd } from '../../apis/hint';
import { useBlurChart } from '../../hooks/useBlurChart';
import { useHints } from '../../hooks/useHints';
import { useQuizList } from '../../hooks/useQuizList';
import BlurChart from '../BlurChart';

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

/** 선택 화면 */
function ChoiceScreen({
  onSelectQuiz,
  onSelectAd,
  onSkip,
}: {
  onSelectQuiz: () => void;
  onSelectAd: () => void;
  onSkip: () => void;
}) {
  return (
    <>
      <S.ChoiceCard onClick={onSelectQuiz}>
        <S.ChoiceTitle>퀴즈 풀기</S.ChoiceTitle>
        <S.ChoiceDesc>
          경제 퀴즈 3문제를 풀어보세요. 정답 수에 따라 더 좋은 힌트를 얻을 수
          있습니다.
        </S.ChoiceDesc>
      </S.ChoiceCard>

      <S.ChoiceCard onClick={onSelectAd}>
        <S.ChoiceTitle>광고 시청</S.ChoiceTitle>
        <S.ChoiceDesc>
          30초 광고를 시청하면 레벨 1 힌트를 바로 받을 수 있습니다.
        </S.ChoiceDesc>
      </S.ChoiceCard>

      <S.SkipButton onClick={onSkip}>힌트 없이 진행하기</S.SkipButton>
    </>
  );
}

/** 퀴즈 화면 */
function QuizScreen({
  year,
  sessionId,
  onComplete,
}: {
  year: number;
  sessionId: string;
  onComplete: (result: QuizAnswerResponse) => void;
}) {
  const { data } = useQuizList(year);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ quiz_id: string; selected_option: number }>
  >([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const submitMutation = useMutation({
    mutationFn: (
      allAnswers: Array<{ quiz_id: string; selected_option: number }>,
    ) => submitQuizAnswers(sessionId, allAnswers),
    onSuccess: (result) => onComplete(result),
  });

  const quizzes = data?.quizzes ?? [];
  const currentQuiz = quizzes[currentIdx];

  const handleNext = useCallback(() => {
    if (selectedOption === null || !currentQuiz) return;

    const newAnswers = [
      ...answers,
      { quiz_id: currentQuiz.quiz_id, selected_option: selectedOption },
    ];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      submitMutation.mutate(newAnswers);
    }
  }, [
    selectedOption,
    currentQuiz,
    answers,
    currentIdx,
    quizzes.length,
    submitMutation,
  ]);

  if (!currentQuiz) {
    return <S.Subtitle>퀴즈를 불러오는 중...</S.Subtitle>;
  }

  return (
    <S.QuizCard>
      <S.QuizNumber>
        문제 {currentIdx + 1} / {quizzes.length}
      </S.QuizNumber>
      <S.QuizQuestion>{currentQuiz.question}</S.QuizQuestion>
      <S.OptionList>
        {currentQuiz.options.map((option, idx) => (
          <S.OptionButton
            key={idx}
            selected={selectedOption === idx}
            onClick={() => setSelectedOption(idx)}
          >
            {option}
          </S.OptionButton>
        ))}
      </S.OptionList>
      <S.SubmitButton
        disabled={selectedOption === null || submitMutation.isPending}
        onClick={handleNext}
      >
        {submitMutation.isPending
          ? '제출 중...'
          : currentIdx < quizzes.length - 1
            ? '다음 문제'
            : '제출하기'}
      </S.SubmitButton>
    </S.QuizCard>
  );
}

/** 광고 시청 화면 */
function AdWatchScreen({
  sessionId,
  year,
  onComplete,
}: {
  sessionId: string;
  year: number;
  onComplete: () => void;
}) {
  const AD_DURATION = 30;
  const [remaining, setRemaining] = useState(AD_DURATION);

  const unlockMutation = useMutation({
    mutationFn: () => unlockHintByAd(sessionId, year),
    onSuccess: () => onComplete(),
  });

  useEffect(() => {
    if (remaining <= 0) {
      unlockMutation.mutate();
      return;
    }

    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, unlockMutation]);

  return (
    <S.TimerContainer>
      <S.Subtitle>광고 시청 중...</S.Subtitle>
      <S.TimerCircle>
        <S.TimerText>{remaining}</S.TimerText>
      </S.TimerCircle>
      <S.Subtitle>완료 후 레벨 1 힌트가 자동으로 해금됩니다</S.Subtitle>
    </S.TimerContainer>
  );
}

/** 퀴즈 결과 화면 */
function QuizResultScreen({
  result,
  onContinue,
}: {
  result: QuizAnswerResponse;
  onContinue: () => void;
}) {
  const rewardText = (() => {
    if (result.reward.hint_level === 2) return '레벨 2 힌트 획득!';
    if (result.reward.hint_level === 1) return '레벨 1 힌트 획득!';
    return '힌트를 얻지 못했습니다';
  })();

  return (
    <>
      <S.ScoreSummary>
        <S.ScoreValue>
          {result.correct_count}/{result.results.length}
        </S.ScoreValue>
        <S.ScoreLabel>정답</S.ScoreLabel>
        <S.RewardBadge level={result.reward.hint_level}>
          {rewardText}
        </S.RewardBadge>
      </S.ScoreSummary>

      {result.results.map((r, idx) => (
        <S.ResultCard key={r.quiz_id} isCorrect={r.is_correct}>
          <S.ResultLabel isCorrect={r.is_correct}>
            문제 {idx + 1}: {r.is_correct ? '정답' : '오답'}
          </S.ResultLabel>
          <S.Explanation>{r.explanation}</S.Explanation>
        </S.ResultCard>
      ))}

      <S.SubmitButton onClick={onContinue}>
        {result.reward.hint_level > 0 ? '힌트 확인하기' : '계속하기'}
      </S.SubmitButton>
    </>
  );
}

/** 힌트 표시 화면 */
function HintDisplayScreen({
  sessionId,
  year,
  onContinue,
}: {
  sessionId: string;
  year: number;
  onContinue: () => void;
}) {
  const { data } = useHints(sessionId);

  const { data: blurData } = useBlurChart(sessionId, year);

  const yearHints = (data?.hints ?? []).filter(
    (h: HintEntry) => h.year === year,
  );

  return (
    <>
      <S.Title>{year}년 투자 힌트</S.Title>

      {yearHints.length === 0 ? (
        <S.Subtitle>이 연도에 해금된 힌트가 없습니다</S.Subtitle>
      ) : (
        yearHints.map((hint: HintEntry, idx: number) => (
          <S.HintCard key={idx}>
            <S.HintLevel>레벨 {hint.level} 힌트</S.HintLevel>
            <S.HintContent>{hint.content}</S.HintContent>
          </S.HintCard>
        ))
      )}

      {blurData && <BlurChart data={blurData} />}

      <S.SubmitButton onClick={onContinue}>투자 시작</S.SubmitButton>
    </>
  );
}

export default HintPhase;

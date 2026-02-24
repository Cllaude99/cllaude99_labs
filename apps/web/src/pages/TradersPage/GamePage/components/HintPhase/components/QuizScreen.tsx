import { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import type { QuizAnswerResponse } from '../../../apis/hint';
import { submitQuizAnswers } from '../../../apis/hint';
import { useQuizList } from '../../../hooks/useQuizList';
import * as S from '../HintPhase.styles';

interface QuizScreenProps {
  year: number;
  sessionId: string;
  onComplete: (result: QuizAnswerResponse) => void;
}

const QuizScreen = ({ year, sessionId, onComplete }: QuizScreenProps) => {
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
};

export default QuizScreen;

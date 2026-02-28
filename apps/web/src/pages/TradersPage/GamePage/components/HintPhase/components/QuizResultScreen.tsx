import type { QuizAnswerResponse } from '../../../apis/hint';
import * as S from '../HintPhase.styles';

interface QuizResultScreenProps {
  result: QuizAnswerResponse;
  onContinue: () => void;
}

const QuizResultScreen = ({ result, onContinue }: QuizResultScreenProps) => {
  const rewardText = (() => {
    if (result.reward.hint_level === 3) return '레벨 3 힌트 획득!';
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
};

export default QuizResultScreen;

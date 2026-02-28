import * as S from '../HintPhase.styles';

interface MinigameResultScreenProps {
  gameType: 'price_prediction' | 'card_match';
  score: number;
  hintLevel: number;
  onContinue: () => void;
}

const GAME_LABELS: Record<string, string> = {
  price_prediction: '주가 예측',
  card_match: '카드 뒤집기',
};

const MinigameResultScreen = ({
  gameType,
  score,
  hintLevel,
  onContinue,
}: MinigameResultScreenProps) => {
  const scoreLabel =
    gameType === 'price_prediction'
      ? `최대 연속 정답 ${score}회`
      : `${score}회 만에 완료`;

  const rewardText = (() => {
    if (hintLevel === 3) return '레벨 3 힌트 획득!';
    if (hintLevel === 2) return '레벨 2 힌트 획득!';
    if (hintLevel === 1) return '레벨 1 힌트 획득!';
    return '힌트를 얻지 못했습니다';
  })();

  return (
    <>
      <S.ScoreSummary>
        <S.ScoreLabel>{GAME_LABELS[gameType]} 결과</S.ScoreLabel>
        <S.ScoreValue>{score}</S.ScoreValue>
        <S.ScoreLabel>{scoreLabel}</S.ScoreLabel>
        <S.RewardBadge level={hintLevel}>{rewardText}</S.RewardBadge>
      </S.ScoreSummary>

      <S.SubmitButton onClick={onContinue}>
        {hintLevel > 0 ? '힌트 확인하기' : '계속하기'}
      </S.SubmitButton>
    </>
  );
};

export default MinigameResultScreen;

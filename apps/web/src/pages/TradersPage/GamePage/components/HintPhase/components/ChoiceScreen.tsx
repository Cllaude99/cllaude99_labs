import * as S from '../HintPhase.styles';

interface ChoiceScreenProps {
  onSelectQuiz: () => void;
  onSelectAd: () => void;
  onSelectMiniGame: () => void;
  onSkip: () => void;
}

const ChoiceScreen = ({
  onSelectQuiz,
  onSelectAd,
  onSelectMiniGame,
  onSkip,
}: ChoiceScreenProps) => {
  return (
    <>
      <S.ChoiceCard onClick={onSelectQuiz}>
        <S.ChoiceTitle>퀴즈 풀기</S.ChoiceTitle>
        <S.ChoiceDesc>
          경제 퀴즈 3문제를 풀어보세요. 정답 수에 따라 더 좋은 힌트를 얻을 수
          있습니다.
        </S.ChoiceDesc>
      </S.ChoiceCard>

      <S.ChoiceCard onClick={onSelectMiniGame}>
        <S.ChoiceTitle>미니게임</S.ChoiceTitle>
        <S.ChoiceDesc>
          주가 예측이나 카드 뒤집기 게임을 플레이하고 힌트를 획득하세요.
        </S.ChoiceDesc>
      </S.ChoiceCard>

      <S.ChoiceCard onClick={onSelectAd}>
        <S.ChoiceTitle>광고 시청</S.ChoiceTitle>
        <S.ChoiceDesc>
          30초 광고를 시청하면 레벨 3 힌트까지 모두 받을 수 있습니다.
        </S.ChoiceDesc>
      </S.ChoiceCard>

      <S.SkipButton onClick={onSkip}>힌트 없이 진행하기</S.SkipButton>
    </>
  );
};

export default ChoiceScreen;

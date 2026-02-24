import * as S from '../HintPhase.styles';

interface ChoiceScreenProps {
  onSelectQuiz: () => void;
  onSelectAd: () => void;
  onSkip: () => void;
}

const ChoiceScreen = ({ onSelectQuiz, onSelectAd, onSkip }: ChoiceScreenProps) => {
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
};

export default ChoiceScreen;

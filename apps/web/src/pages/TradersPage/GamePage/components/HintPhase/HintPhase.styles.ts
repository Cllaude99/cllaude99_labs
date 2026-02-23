import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 16px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.palette.white};
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
  text-align: center;
  line-height: 1.5;
`;

const ChoiceCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.palette.blue500};
    background-color: ${({ theme }) => `${theme.palette.blue500}0D`};
  }
`;

const ChoiceTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
`;

const ChoiceDesc = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey500};
  line-height: 1.4;
`;

const QuizCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const QuizNumber = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue500};
`;

const QuizQuestion = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.grey900};
  margin: 8px 0 16px;
  line-height: 1.5;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionButton = styled.button<{
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
}>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, selected, correct, wrong }) => {
      if (correct) return theme.palette.blue500;
      if (wrong) return theme.palette.red500;
      if (selected) return theme.palette.blue400;
      return theme.palette.grey200;
    }};
  background-color: ${({ theme, selected, correct, wrong }) => {
    if (correct) return `${theme.palette.blue500}1A`;
    if (wrong) return `${theme.palette.red500}1A`;
    if (selected) return `${theme.palette.blue400}1A`;
    return 'transparent';
  }};
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.palette.blue400};
  }

  &:disabled {
    cursor: default;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.palette.blue500};
  color: ${({ theme }) => theme.palette.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ResultCard = styled.div<{ isCorrect: boolean }>`
  padding: 16px;
  background-color: ${({ theme, isCorrect }) =>
    isCorrect ? `${theme.palette.blue500}14` : `${theme.palette.red500}14`};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isCorrect }) => (isCorrect ? theme.palette.blue100 : theme.palette.red100)};
`;

const ResultLabel = styled.span<{ isCorrect: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, isCorrect }) => (isCorrect ? theme.palette.blue500 : theme.palette.red500)};
`;

const Explanation = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey600};
  margin-top: 8px;
  line-height: 1.5;
`;

const ScoreSummary = styled.div`
  text-align: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.grey150};
`;

const ScoreValue = styled.span`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.palette.blue500};
`;

const ScoreLabel = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.grey500};
  margin-top: 4px;
`;

const RewardBadge = styled.div<{ level: number }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  margin-top: 12px;
  background-color: ${({ theme, level }) =>
    level === 2
      ? `${theme.palette.blue500}26`
      : level === 1
        ? `${theme.palette.blue400}26`
        : `${theme.palette.grey300}26`};
  color: ${({ theme, level }) =>
    level === 2 ? theme.palette.blue500 : level === 1 ? theme.palette.blue400 : theme.palette.grey300};
  font-size: 13px;
  font-weight: 600;
`;

const HintCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.grey50};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.blue100};
`;

const HintLevel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue500};
`;

const HintContent = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.palette.grey900};
  line-height: 1.6;
  margin-top: 8px;
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
`;

const TimerCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.palette.blue500};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimerText = styled.span`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.grey900};
  font-variant-numeric: tabular-nums;
`;

const SkipButton = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.grey300};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;

  &:hover {
    color: ${({ theme }) => theme.palette.grey500};
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.grey200};
  background-color: transparent;
  color: ${({ theme }) => theme.palette.grey900};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey50};
  }
`;

export {
  Container,
  Title,
  Subtitle,
  ChoiceCard,
  ChoiceTitle,
  ChoiceDesc,
  QuizCard,
  QuizNumber,
  QuizQuestion,
  OptionList,
  OptionButton,
  SubmitButton,
  ResultCard,
  ResultLabel,
  Explanation,
  ScoreSummary,
  ScoreValue,
  ScoreLabel,
  RewardBadge,
  HintCard,
  HintLevel,
  HintContent,
  TimerContainer,
  TimerCircle,
  TimerText,
  SkipButton,
  ContinueButton,
};

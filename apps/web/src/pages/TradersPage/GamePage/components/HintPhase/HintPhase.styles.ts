import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 16px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.traders.bgPrimary};
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: center;
  line-height: 1.5;
`;

const ChoiceCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
    background-color: ${({ theme }) => `${theme.traders.ctaPrimary}0D`};
  }
`;

const ChoiceTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const ChoiceDesc = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.traders.textSecondary};
  line-height: 1.4;
`;

const QuizCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const QuizNumber = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.ctaPrimary};
`;

const QuizQuestion = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
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
      if (correct) return theme.traders.ctaPrimary;
      if (wrong) return theme.traders.statusError;
      if (selected) return theme.traders.ctaSecondaryBorder;
      return theme.traders.borderPrimary;
    }};
  background-color: ${({ theme, selected, correct, wrong }) => {
    if (correct) return `${theme.traders.ctaPrimary}1A`;
    if (wrong) return `${theme.traders.statusError}1A`;
    if (selected) return `${theme.traders.ctaSecondaryBorder}1A`;
    return 'transparent';
  }};
  color: ${({ theme }) => theme.traders.textPrimary};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.traders.ctaSecondaryBorder};
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
  background-color: ${({ theme }) => theme.traders.ctaPrimary};
  color: ${({ theme }) => theme.traders.textInverse};
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
    isCorrect ? `${theme.traders.ctaPrimary}14` : `${theme.traders.statusError}14`};
  border-radius: 10px;
  border: 1px solid
    ${({ theme, isCorrect }) =>
      isCorrect ? theme.traders.ctaPrimaryLight : theme.traders.statusErrorLight};
`;

const ResultLabel = styled.span<{ isCorrect: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, isCorrect }) =>
    isCorrect ? theme.traders.ctaPrimary : theme.traders.statusError};
`;

const Explanation = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.traders.textSecondary};
  margin-top: 8px;
  line-height: 1.5;
`;

const ScoreSummary = styled.div`
  text-align: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const ScoreValue = styled.span`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.traders.ctaPrimary};
`;

const ScoreLabel = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.traders.textSecondary};
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
    level >= 3
      ? `${theme.traders.ctaPrimary}26`
      : level === 2
        ? `${theme.traders.ctaPrimary}1A`
        : level === 1
          ? `${theme.traders.ctaSecondaryBorder}26`
          : `${theme.traders.textTertiary}26`};
  color: ${({ theme, level }) =>
    level >= 2
      ? theme.traders.ctaPrimary
      : level === 1
        ? theme.traders.ctaSecondaryText
        : theme.traders.textTertiary};
  font-size: 13px;
  font-weight: 600;
`;

const HintCard = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.ctaPrimaryLight};
`;

const HintLevel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.ctaPrimary};
`;

const HintContent = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.traders.textPrimary};
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
  border: 4px solid ${({ theme }) => theme.traders.ctaPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimerText = styled.span`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const SkipButton = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.traders.textTertiary};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;

  &:hover {
    color: ${({ theme }) => theme.traders.textSecondary};
  }
`;

const StockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StockCard = styled.button<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 12px;
  background-color: ${({ theme, selected }) =>
    selected ? `${theme.traders.ctaPrimary}1A` : theme.traders.bgSecondary};
  border-radius: 12px;
  border: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.traders.ctaPrimary : theme.traders.borderSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
  }
`;

const StockCardCode = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const StockCardCategory = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.traders.textTertiary};
`;

const GameSelectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GameSelectCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 16px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.traders.ctaPrimary};
    background-color: ${({ theme }) => `${theme.traders.ctaPrimary}0D`};
  }
`;

const GameSelectIcon = styled.span`
  font-size: 32px;
`;

const GameSelectName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
`;

const GameSelectDesc = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.traders.textSecondary};
  text-align: center;
  line-height: 1.4;
`;

const MiniGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: ${({ theme }) => theme.traders.bgSecondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.traders.borderSecondary};
`;

const PredictionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
`;

const PredictButton = styled.button<{ variant: 'up' | 'down' }>`
  padding: 16px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${({ theme, variant }) =>
    variant === 'up' ? `${theme.traders.statusError}1A` : `${theme.traders.ctaPrimary}1A`};
  color: ${({ theme, variant }) =>
    variant === 'up' ? theme.traders.statusError : theme.traders.ctaPrimary};
  border: 1px solid
    ${({ theme, variant }) =>
      variant === 'up' ? theme.traders.statusErrorLight : theme.traders.ctaPrimaryLight};

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textSecondary};
`;

const ResultFeedback = styled.div<{ isCorrect: boolean }>`
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  background-color: ${({ theme, isCorrect }) =>
    isCorrect ? `${theme.traders.ctaPrimary}1A` : `${theme.traders.statusError}1A`};
  color: ${({ theme, isCorrect }) =>
    isCorrect ? theme.traders.ctaPrimary : theme.traders.statusError};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const FlipCard = styled.button<{ flipped: boolean; matched: boolean }>`
  aspect-ratio: 1;
  border-radius: 8px;
  border: 2px solid
    ${({ theme, matched, flipped }) =>
      matched
        ? theme.traders.ctaPrimary
        : flipped
          ? theme.traders.ctaSecondaryBorder
          : theme.traders.borderSecondary};
  background-color: ${({ theme, matched, flipped }) =>
    matched
      ? `${theme.traders.ctaPrimary}1A`
      : flipped
        ? theme.traders.bgSecondary
        : theme.traders.bgTertiary};
  cursor: ${({ matched, flipped }) =>
    matched || flipped ? 'default' : 'pointer'};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  transition: all 0.3s;
  transform: ${({ flipped, matched }) =>
    flipped || matched ? 'rotateY(0deg)' : 'rotateY(180deg)'};
  transform-style: preserve-3d;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.traders.ctaSecondaryBorder};
  }
`;

const AttemptsCounter = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.traders.textSecondary};
  font-weight: 600;
`;

const RoundLabel = styled.div`
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.traders.ctaPrimary};
`;

const MiniChartWrapper = styled.div`
  width: 100%;
  height: 180px;
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
  StockGrid,
  StockCard,
  StockCardCode,
  StockCardCategory,
  GameSelectGrid,
  GameSelectCard,
  GameSelectIcon,
  GameSelectName,
  GameSelectDesc,
  MiniGameContainer,
  PredictionButtons,
  PredictButton,
  ScoreDisplay,
  ResultFeedback,
  CardGrid,
  FlipCard,
  AttemptsCounter,
  RoundLabel,
  MiniChartWrapper,
};

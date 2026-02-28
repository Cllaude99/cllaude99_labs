import * as S from '../HintPhase.styles';

type GameType = 'price_prediction' | 'card_match';

interface MiniGameSelectScreenProps {
  onSelect: (gameType: GameType) => void;
}

const MiniGameSelectScreen = ({ onSelect }: MiniGameSelectScreenProps) => {
  return (
    <>
      <S.Title>미니게임 선택</S.Title>
      <S.Subtitle>플레이할 미니게임을 선택하세요</S.Subtitle>
      <S.GameSelectGrid>
        <S.GameSelectCard onClick={() => onSelect('price_prediction')}>
          <S.GameSelectIcon>📈</S.GameSelectIcon>
          <S.GameSelectName>주가 예측</S.GameSelectName>
          <S.GameSelectDesc>
            과거 차트를 보고 다음 달 상승/하락을 맞춰보세요
          </S.GameSelectDesc>
        </S.GameSelectCard>
        <S.GameSelectCard onClick={() => onSelect('card_match')}>
          <S.GameSelectIcon>🃏</S.GameSelectIcon>
          <S.GameSelectName>카드 뒤집기</S.GameSelectName>
          <S.GameSelectDesc>
            경제 용어 짝을 맞추는 메모리 게임
          </S.GameSelectDesc>
        </S.GameSelectCard>
      </S.GameSelectGrid>
    </>
  );
};

export default MiniGameSelectScreen;

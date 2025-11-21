import * as S from './TradersPage.styles';

const TradersPage = () => {
  return (
    <S.Container>
      <S.Content
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <S.ComingSoonText>Coming Soon</S.ComingSoonText>
        <S.Description>
          과거로 돌아가 주식 투자를 다시 해보는 실시간 시뮬레이션 게임이 곧
          공개됩니다
        </S.Description>
      </S.Content>
    </S.Container>
  );
};

export default TradersPage;

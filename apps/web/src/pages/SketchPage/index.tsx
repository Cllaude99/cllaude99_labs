import * as S from './SketchPage.styles';

const SketchPage = () => {
  return (
    <S.Container>
      <S.Content
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <S.ComingSoonText>Coming Soon</S.ComingSoonText>
        <S.Description>
          실시간 협업이 가능한 캔버스가 곧 공개됩니다
        </S.Description>
      </S.Content>
    </S.Container>
  );
};

export default SketchPage;

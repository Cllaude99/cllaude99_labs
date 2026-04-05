import Layout from '@/components/Layout';

import * as S from './SamplePage.styles';

const SamplePage = () => {
  return (
    <Layout>
      <S.Container>
        <S.Title>Sample Page</S.Title>
        <S.Description>
          Claude Code PR 테스트를 위한 샘플 페이지입니다.
        </S.Description>
      </S.Container>
    </Layout>
  );
};

export default SamplePage;

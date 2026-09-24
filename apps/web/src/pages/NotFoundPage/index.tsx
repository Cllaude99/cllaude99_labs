import { PATH } from '@/constants';

import * as S from './NotFoundPage.styles';

const NotFoundPage = () => {
  return (
    <S.Container>
      <S.ErrorCode>404</S.ErrorCode>
      <S.Message>페이지를 찾을 수 없습니다.</S.Message>
      <S.HomeLink href={PATH.ROOT}>홈으로 돌아가기</S.HomeLink>
    </S.Container>
  );
};

export default NotFoundPage;

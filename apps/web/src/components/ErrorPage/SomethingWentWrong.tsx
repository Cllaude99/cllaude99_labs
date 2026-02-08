import { useNavigate } from 'react-router-dom';

import Button from '@cllaude99/ui/Button';

import Layout from '@/components/Layout';

import * as S from './SomethingWentWrong.styles';

interface SomethingWentWrongProps {
  onRetry?: () => void;
  status?: string;
  errorMessage?: string;
}

const SomethingWentWrong = ({
  onRetry,
  status,
  errorMessage,
}: SomethingWentWrongProps) => {
  const navigate = useNavigate();

  return (
    <Layout
      layoutStyle={{
        alignItems: 'center',
      }}
    >
      <S.ErrorImage src="/SomethingWentWrong.png" alt="오류가 발생했습니다" />
      <S.Title>오류가 발생하였습니다.</S.Title>
      <S.Description>
        문제를 해결하기 위해 열심히 노력하고 있어요.
        {'\n'}잠시 후 다시 시도해 주세요!
      </S.Description>
      {status && <S.ErrorText>{status}</S.ErrorText>}
      {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
      <S.ButtonWrapper>
        {onRetry && (
          <Button variant="primary" size="medium" onClick={onRetry}>
            다시 시도하기
          </Button>
        )}
        <Button variant="primary" size="medium" onClick={() => navigate('/')}>
          홈으로 이동
        </Button>
      </S.ButtonWrapper>
    </Layout>
  );
};

export default SomethingWentWrong;

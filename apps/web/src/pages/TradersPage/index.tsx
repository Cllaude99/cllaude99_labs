import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { PATH } from '@/constants';

import { createGame } from './apis/game';
import { useGameStore } from './stores/gameStore';
import * as S from './TradersPage.styles';

const FEATURES = [
  { title: '2010~2025', desc: '16년간의 실제 주가 데이터' },
  { title: '10개 종목', desc: '익명화된 종목으로 순수 분석' },
  { title: '힌트 시스템', desc: '퀴즈를 풀어 힌트 획득' },
  { title: '랭킹', desc: '다른 플레이어와 수익률 비교' },
];

const TradersPage = () => {
  const navigate = useNavigate();
  const { sessionId, setSession } = useGameStore();
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  const createMutation = useMutation({
    mutationFn: () => createGame(nickname.trim() || undefined),
    onSuccess: (data) => {
      setSession(data.session_id, data.stocks);
      navigate(PATH.TRADERS_GAME);
    },
    onError: (err: Error) => {
      setError(err.message || '게임 생성에 실패했습니다');
    },
  });

  const handleStart = () => {
    setError(null);
    createMutation.mutate();
  };

  const handleResume = () => {
    navigate(PATH.TRADERS_GAME);
  };

  return (
    <S.Container>
      <S.Content
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <S.Title>Traders</S.Title>
        <S.Subtitle>
          과거로 돌아가 주식 투자를 다시 해보세요.
          2010년부터 2025년까지, 16년간의 실제 주가 데이터로 투자 시뮬레이션을
          경험하세요.
        </S.Subtitle>

        <S.FeatureGrid>
          {FEATURES.map((feature) => (
            <S.FeatureCard key={feature.title}>
              <S.FeatureTitle>{feature.title}</S.FeatureTitle>
              <S.FeatureDesc>{feature.desc}</S.FeatureDesc>
            </S.FeatureCard>
          ))}
        </S.FeatureGrid>

        <S.NicknameInput
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
        />

        {sessionId ? (
          <>
            <S.ResumeButton
              whileTap={{ scale: 0.97 }}
              onClick={handleResume}
            >
              이어하기
            </S.ResumeButton>
            <S.StartButton
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              disabled={createMutation.isPending || !nickname.trim()}
            >
              {createMutation.isPending ? '생성 중...' : '새 게임 시작'}
            </S.StartButton>
          </>
        ) : (
          <S.StartButton
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            disabled={createMutation.isPending || !nickname.trim()}
          >
            {createMutation.isPending ? '생성 중...' : '게임 시작'}
          </S.StartButton>
        )}

        <S.MultiplayButton
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(PATH.TRADERS_ROOM)}
        >
          멀티플레이
        </S.MultiplayButton>

        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.RankingLink onClick={() => navigate(PATH.TRADERS_RANKING)}>
          랭킹 보기
        </S.RankingLink>
      </S.Content>
    </S.Container>
  );
};

export default TradersPage;

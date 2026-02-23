import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRankings } from './hooks/useRankings';
import * as S from './RankingPage.styles';

const RankingPage = () => {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useRankings();

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [handleObserver]);

  const rankings = data?.pages.flatMap((page) => page.rankings) ?? [];

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>←</S.BackButton>
        <S.Title>랭킹</S.Title>
      </S.Header>

      <S.Content>
        {isLoading ? (
          <S.EmptyState>랭킹을 불러오는 중...</S.EmptyState>
        ) : isError ? (
          <S.EmptyState>
            랭킹을 불러오는 데 실패했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </S.EmptyState>
        ) : rankings.length === 0 ? (
          <S.EmptyState>아직 랭킹 데이터가 없습니다</S.EmptyState>
        ) : (
          <S.RankingList>
            {rankings.map((entry) => {
              const isTop3 = entry.rank_position <= 3;
              const isProfit = entry.total_return_rate >= 0;

              return (
                <S.RankingItem key={entry.rank_position} isTop3={isTop3}>
                  <S.RankNumber isTop3={isTop3}>
                    {entry.rank_position}
                  </S.RankNumber>
                  <S.RankInfo>
                    <S.Nickname>{entry.nickname}</S.Nickname>
                    <S.RankDetail>
                      최종 자산 {entry.final_asset.toLocaleString()}원 ·{' '}
                      {entry.total_trades}회 거래
                    </S.RankDetail>
                  </S.RankInfo>
                  <S.RankReturn isProfit={isProfit}>
                    {isProfit ? '+' : ''}
                    {entry.total_return_rate.toFixed(1)}%
                  </S.RankReturn>
                </S.RankingItem>
              );
            })}

            <S.LoadMoreTrigger ref={observerRef}>
              {isFetchingNextPage ? '불러오는 중...' : ''}
            </S.LoadMoreTrigger>
          </S.RankingList>
        )}
      </S.Content>
    </S.Container>
  );
};

export default RankingPage;

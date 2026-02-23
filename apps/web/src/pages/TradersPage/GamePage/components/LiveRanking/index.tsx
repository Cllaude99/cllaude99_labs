import { useState } from 'react';

import * as S from './LiveRanking.styles';
import type { LiveRankingEntry } from '../../../apis/ranking';
import { useLiveRanking } from '../../hooks/useLiveRanking';


interface LiveRankingProps {
  sessionId: string | null;
}

const LiveRanking = ({ sessionId }: LiveRankingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useLiveRanking(sessionId);

  if (!data) {
    return (
      <S.Badge onClick={() => setIsOpen(true)}>
        #-
      </S.Badge>
    );
  }

  const renderRankItem = (entry: LiveRankingEntry, isMe: boolean = false) => {
    const isProfit = entry.return_rate >= 0;
    return (
      <S.RankItem key={`${entry.rank_position}-${entry.nickname}`} isMe={isMe}>
        <S.RankPosition isTop3={entry.rank_position <= 3}>
          {entry.rank_position}
        </S.RankPosition>
        <S.RankInfo>
          <S.RankNickname>{entry.nickname}</S.RankNickname>
          <S.RankYear>{entry.current_year}년 진행 중</S.RankYear>
        </S.RankInfo>
        <S.RankReturnRate isProfit={isProfit}>
          {isProfit ? '+' : ''}
          {entry.return_rate.toFixed(1)}%
        </S.RankReturnRate>
      </S.RankItem>
    );
  };

  const myIsProfit = data.my_return_rate >= 0;
  const hasNearby = data.nearby_players.length > 0;
  const nearbyContainsTopOverlap = data.nearby_players.some((np) =>
    data.top_players.some((tp) => tp.rank_position === np.rank_position),
  );
  const filteredNearby = nearbyContainsTopOverlap
    ? data.nearby_players.filter(
        (np) => !data.top_players.some((tp) => tp.rank_position === np.rank_position),
      )
    : data.nearby_players;

  return (
    <>
      <S.Badge onClick={() => setIsOpen(true)}>
        #{data.my_rank}위
      </S.Badge>

      <S.Overlay open={isOpen} onClick={() => setIsOpen(false)} />
      <S.Drawer open={isOpen}>
        <S.DrawerHeader>
          <S.DrawerTitle>실시간 랭킹</S.DrawerTitle>
          <S.CloseButton onClick={() => setIsOpen(false)}>×</S.CloseButton>
        </S.DrawerHeader>

        <S.MyRankSection>
          <S.MyRankLabel>내 순위</S.MyRankLabel>
          <S.MyRankValue>
            {data.my_rank}위{' '}
            <S.TotalPlayers>/ {data.total_players}명</S.TotalPlayers>
          </S.MyRankValue>
          <S.MyReturnRate isProfit={myIsProfit}>
            수익률 {myIsProfit ? '+' : ''}
            {data.my_return_rate.toFixed(1)}%
          </S.MyReturnRate>
        </S.MyRankSection>

        <S.RankList>
          <S.SectionLabel>Top 5</S.SectionLabel>
          {data.top_players.map((entry) =>
            renderRankItem(entry, entry.rank_position === data.my_rank),
          )}

          {hasNearby && filteredNearby.length > 0 && (
            <>
              <S.Separator>···</S.Separator>
              <S.SectionLabel>내 주변</S.SectionLabel>
              {filteredNearby.map((entry) =>
                renderRankItem(entry, entry.rank_position === data.my_rank),
              )}
            </>
          )}
        </S.RankList>
      </S.Drawer>
    </>
  );
};

export default LiveRanking;

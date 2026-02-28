import * as S from './RoundResult.styles';
import type { RoomRoundRanking } from '../../../interfaces/room';


interface RoundResultProps {
  year: number;
  rankings: RoomRoundRanking[];
  isHost: boolean;
  isGameCompleted: boolean;
  myParticipantId: string;
  onNext: () => void;
  isPending: boolean;
}

const RoundResult = ({
  year,
  rankings,
  isHost,
  isGameCompleted,
  myParticipantId,
  onNext,
  isPending,
}: RoundResultProps) => {
  return (
    <S.Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <S.Header>
        <S.Title>{year}년 라운드 결과</S.Title>
        <S.YearLabel>
          {isGameCompleted ? '최종 라운드' : `${year - 2010 + 1}/15 라운드`}
        </S.YearLabel>
      </S.Header>

      <S.RankingTable>
        <S.RankingHeader>
          <S.HeaderCell>순위</S.HeaderCell>
          <S.HeaderCell>닉네임</S.HeaderCell>
          <S.HeaderCell>자산</S.HeaderCell>
          <S.HeaderCell>수익률</S.HeaderCell>
        </S.RankingHeader>

        {rankings.map((entry) => {
          const isMe = entry.participant_id === myParticipantId;
          const isTop3 = entry.rank <= 3;
          const isProfit = entry.return_rate >= 0;

          return (
            <S.RankingRow
              key={entry.participant_id}
              isMe={isMe}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: entry.rank * 0.05 }}
            >
              <S.RankCell isTop3={isTop3}>{entry.rank}</S.RankCell>
              <S.NicknameCell>{entry.nickname}</S.NicknameCell>
              <S.AssetCell>
                {(entry.ending_asset / 10000).toFixed(0)}만
              </S.AssetCell>
              <S.ReturnCell isProfit={isProfit}>
                {isProfit ? '+' : ''}
                {entry.return_rate.toFixed(1)}%
              </S.ReturnCell>
            </S.RankingRow>
          );
        })}
      </S.RankingTable>

      {isHost ? (
        <S.NextButton
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={isPending}
        >
          {isPending
            ? '진행 중...'
            : isGameCompleted
              ? '최종 결과 보기'
              : '다음 라운드'}
        </S.NextButton>
      ) : (
        <S.WaitingText>
          방장이 다음 라운드를 시작할 때까지 대기 중...
        </S.WaitingText>
      )}
    </S.Container>
  );
};

export default RoundResult;

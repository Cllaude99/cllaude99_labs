import type { HintEntry } from '../../../apis/hint';
import { useBlurChart } from '../../../hooks/useBlurChart';
import { useHints } from '../../../hooks/useHints';
import BlurChart from '../../BlurChart';
import * as S from '../HintPhase.styles';

interface HintDisplayScreenProps {
  sessionId: string;
  year: number;
  stockId?: string;
  onContinue: () => void;
}

const HintDisplayScreen = ({
  sessionId,
  year,
  stockId,
  onContinue,
}: HintDisplayScreenProps) => {
  const { data } = useHints(sessionId);
  const { data: blurData } = useBlurChart(sessionId, year);

  const yearHints = (data?.hints ?? []).filter((h: HintEntry) => {
    if (h.year !== year) return false;
    if (stockId) return h.stock_id === stockId || h.stock_id === null;
    return true;
  });

  return (
    <>
      <S.Title>{year}년 투자 힌트</S.Title>

      {yearHints.length === 0 ? (
        <S.Subtitle>이 연도에 해금된 힌트가 없습니다</S.Subtitle>
      ) : (
        yearHints.map((hint: HintEntry, idx: number) => (
          <S.HintCard key={idx}>
            <S.HintLevel>레벨 {hint.level} 힌트</S.HintLevel>
            <S.HintContent>{hint.content}</S.HintContent>
          </S.HintCard>
        ))
      )}

      {blurData && <BlurChart data={blurData} stockId={stockId} />}

      <S.SubmitButton onClick={onContinue}>투자 시작</S.SubmitButton>
    </>
  );
};

export default HintDisplayScreen;

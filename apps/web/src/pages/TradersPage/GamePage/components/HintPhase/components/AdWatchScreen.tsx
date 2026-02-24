import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { unlockHintByAd } from '../../../apis/hint';
import * as S from '../HintPhase.styles';

const AD_DURATION = 30;

interface AdWatchScreenProps {
  sessionId: string;
  year: number;
  onComplete: () => void;
}

const AdWatchScreen = ({ sessionId, year, onComplete }: AdWatchScreenProps) => {
  const [remaining, setRemaining] = useState(AD_DURATION);

  const unlockMutation = useMutation({
    mutationFn: () => unlockHintByAd(sessionId, year),
    onSuccess: () => onComplete(),
  });

  useEffect(() => {
    if (remaining <= 0) {
      unlockMutation.mutate();
      return;
    }

    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, unlockMutation]);

  return (
    <S.TimerContainer>
      <S.Subtitle>광고 시청 중...</S.Subtitle>
      <S.TimerCircle>
        <S.TimerText>{remaining}</S.TimerText>
      </S.TimerCircle>
      <S.Subtitle>완료 후 레벨 1 힌트가 자동으로 해금됩니다</S.Subtitle>
    </S.TimerContainer>
  );
};

export default AdWatchScreen;

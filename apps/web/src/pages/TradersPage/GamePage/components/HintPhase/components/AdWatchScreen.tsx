import { useEffect, useState } from 'react';

import * as S from '../HintPhase.styles';

const AD_DURATION = 30;

interface AdWatchScreenProps {
  onComplete: () => void;
}

const AdWatchScreen = ({ onComplete }: AdWatchScreenProps) => {
  const [remaining, setRemaining] = useState(AD_DURATION);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return (
    <S.TimerContainer>
      <S.Subtitle>광고 시청 중...</S.Subtitle>
      <S.TimerCircle>
        <S.TimerText>{remaining}</S.TimerText>
      </S.TimerCircle>
      <S.Subtitle>완료 후 레벨 3 힌트를 받을 수 있습니다</S.Subtitle>
    </S.TimerContainer>
  );
};

export default AdWatchScreen;

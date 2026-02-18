import { useCallback, useEffect, useRef, useState } from 'react';

import * as S from './ScreenReaderSimulator.styles';

interface ScreenReaderSimulatorProps {
  lines: string[];
  label?: string;
}

const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'ko-KR';
    utterance.rate = 1.2;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

const ScreenReaderSimulator = ({
  lines,
  label = '스크린 리더 출력',
}: ScreenReaderSimulatorProps) => {
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const cancelledRef = useRef(false);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    stop();
    cancelledRef.current = false;
    setIsPlaying(true);

    for (let i = 0; i < lines.length; i++) {
      if (cancelledRef.current) break;
      setActiveLine(i);
      await speak(lines[i]);
    }

    if (!cancelledRef.current) {
      setActiveLine(-1);
    }
    setIsPlaying(false);
  }, [lines, stop]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <S.Container>
      <S.Label>
        <span aria-hidden="true">🔊</span>
        {label}
      </S.Label>
      <S.Terminal role="log" aria-label={label}>
        {lines.map((line, index) => (
          <S.Line key={`${line}-${index}`} isActive={activeLine === index}>
            {activeLine === index ? '▶ ' : '  '}
            {line}
          </S.Line>
        ))}
      </S.Terminal>
      <S.PlayButton
        type="button"
        onClick={play}
        disabled={isPlaying}
        aria-label="스크린 리더 시뮬레이션 재생"
      >
        {isPlaying ? '재생 중...' : '▶ 재생'}
      </S.PlayButton>
    </S.Container>
  );
};

export default ScreenReaderSimulator;

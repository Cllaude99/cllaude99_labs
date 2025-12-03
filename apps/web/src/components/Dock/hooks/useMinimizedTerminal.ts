import { useState, useCallback } from 'react';

const useMinimizedTerminal = () => {
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

  /* 터미널 최소화 */
  const minimizeTerminal = useCallback(() => {
    setIsTerminalMinimized(true);
  }, []);

  /* 터미널 복원 */
  const restoreTerminal = useCallback(() => {
    setIsTerminalMinimized(false);
  }, []);

  return {
    isTerminalMinimized,
    minimizeTerminal,
    restoreTerminal,
  };
};

export default useMinimizedTerminal;

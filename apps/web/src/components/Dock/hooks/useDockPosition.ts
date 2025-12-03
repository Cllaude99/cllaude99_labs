import { useEffect, useState } from 'react';

import { DockPosition } from '../types';

const STORAGE_KEY = 'cllaude99_labs_dock_position';
const DEFAULT_POSITION: DockPosition = 'bottom';

const useDockPosition = () => {
  const [position, setPosition] = useState<DockPosition>((): DockPosition => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as DockPosition) || DEFAULT_POSITION;
    } catch {
      return DEFAULT_POSITION;
    }
  });

  const togglePosition = () => {
    setPosition((prev) => (prev === 'bottom' ? 'left' : 'bottom'));
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, position);
    } catch (error) {
      console.error('Dock 위치 저장 실패:', error);
    }
  }, [position]);

  return { position, setPosition, togglePosition };
};

export default useDockPosition;
